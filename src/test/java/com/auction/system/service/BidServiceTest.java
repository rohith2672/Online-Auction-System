package com.auction.system.service;

import com.auction.system.dto.BidRequest;
import com.auction.system.dto.BidResponse;
import com.auction.system.model.AuctionItem;
import com.auction.system.model.Bid;
import com.auction.system.model.User;
import com.auction.system.repository.AuctionItemRepository;
import com.auction.system.repository.BidRepository;
import com.auction.system.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class BidServiceTest {

    @Mock private BidRepository bidRepository;
    @Mock private AuctionItemRepository itemRepository;
    @Mock private UserRepository userRepository;
    @Mock private SimpMessagingTemplate messagingTemplate;
    @Mock private Authentication authentication;
    @Mock private SecurityContext securityContext;

    @InjectMocks private BidService bidService;

    private User buyer;
    private User seller;
    private AuctionItem activeItem;

    @BeforeEach
    void setUp() {
        buyer = User.builder()
                .id(UUID.randomUUID())
                .username("buyer1")
                .role(User.Role.USER)
                .credits(BigDecimal.valueOf(1000))
                .build();

        seller = User.builder()
                .id(UUID.randomUUID())
                .username("seller1")
                .role(User.Role.SELLER)
                .credits(BigDecimal.valueOf(500))
                .build();

        activeItem = AuctionItem.builder()
                .id(UUID.randomUUID())
                .seller(seller)
                .name("Laptop")
                .startingPrice(BigDecimal.valueOf(200))
                .currentPrice(BigDecimal.valueOf(200))
                .startTime(OffsetDateTime.now().minusHours(1))
                .endTime(OffsetDateTime.now().plusDays(1))
                .status(AuctionItem.Status.ACTIVE)
                .build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // ── placeBid ──────────────────────────────────────────────────────────────

    @Test
    void placeBid_validBid_success() {
        BidRequest req = new BidRequest(activeItem.getId(), BigDecimal.valueOf(300));

        when(authentication.getName()).thenReturn("buyer1");
        when(userRepository.findByUsername("buyer1")).thenReturn(Optional.of(buyer));
        when(itemRepository.findById(activeItem.getId())).thenReturn(Optional.of(activeItem));

        Bid savedBid = Bid.builder()
                .id(UUID.randomUUID())
                .item(activeItem)
                .user(buyer)
                .amount(BigDecimal.valueOf(300))
                .timestamp(OffsetDateTime.now())
                .build();
        when(bidRepository.save(any(Bid.class))).thenReturn(savedBid);
        when(itemRepository.save(any(AuctionItem.class))).thenReturn(activeItem);

        BidResponse response = bidService.placeBid(req);

        assertThat(response.getAmount()).isEqualByComparingTo(BigDecimal.valueOf(300));
        assertThat(response.getUsername()).isEqualTo("buyer1");
        verify(messagingTemplate).convertAndSend(
                eq("/topic/bids/" + activeItem.getId()), any(BidResponse.class));
    }

    @Test
    void placeBid_bySeller_throwsException() {
        BidRequest req = new BidRequest(activeItem.getId(), BigDecimal.valueOf(300));
        when(authentication.getName()).thenReturn("seller1");
        when(userRepository.findByUsername("seller1")).thenReturn(Optional.of(seller));

        assertThatThrownBy(() -> bidService.placeBid(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Only standard users can place bids");
    }

    @Test
    void placeBid_itemNotFound_throwsException() {
        UUID unknownId = UUID.randomUUID();
        BidRequest req = new BidRequest(unknownId, BigDecimal.valueOf(300));
        when(authentication.getName()).thenReturn("buyer1");
        when(userRepository.findByUsername("buyer1")).thenReturn(Optional.of(buyer));
        when(itemRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bidService.placeBid(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Item not found");
    }

    @Test
    void placeBid_inactiveAuction_throwsException() {
        activeItem.setStatus(AuctionItem.Status.ENDED);
        BidRequest req = new BidRequest(activeItem.getId(), BigDecimal.valueOf(300));
        when(authentication.getName()).thenReturn("buyer1");
        when(userRepository.findByUsername("buyer1")).thenReturn(Optional.of(buyer));
        when(itemRepository.findById(activeItem.getId())).thenReturn(Optional.of(activeItem));

        assertThatThrownBy(() -> bidService.placeBid(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Auction is not active");
    }

    @Test
    void placeBid_auctionEnded_throwsException() {
        activeItem.setEndTime(OffsetDateTime.now().minusMinutes(1));
        BidRequest req = new BidRequest(activeItem.getId(), BigDecimal.valueOf(300));
        when(authentication.getName()).thenReturn("buyer1");
        when(userRepository.findByUsername("buyer1")).thenReturn(Optional.of(buyer));
        when(itemRepository.findById(activeItem.getId())).thenReturn(Optional.of(activeItem));

        assertThatThrownBy(() -> bidService.placeBid(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Auction has ended");
    }

    @Test
    void placeBid_amountTooLow_throwsException() {
        BidRequest req = new BidRequest(activeItem.getId(), BigDecimal.valueOf(150));
        when(authentication.getName()).thenReturn("buyer1");
        when(userRepository.findByUsername("buyer1")).thenReturn(Optional.of(buyer));
        when(itemRepository.findById(activeItem.getId())).thenReturn(Optional.of(activeItem));

        assertThatThrownBy(() -> bidService.placeBid(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Bid amount must be higher than the current price");
    }

    @Test
    void placeBid_insufficientCredits_throwsException() {
        buyer.setCredits(BigDecimal.valueOf(50));
        BidRequest req = new BidRequest(activeItem.getId(), BigDecimal.valueOf(300));
        when(authentication.getName()).thenReturn("buyer1");
        when(userRepository.findByUsername("buyer1")).thenReturn(Optional.of(buyer));
        when(itemRepository.findById(activeItem.getId())).thenReturn(Optional.of(activeItem));

        assertThatThrownBy(() -> bidService.placeBid(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Insufficient credits");
    }

    // ── getBidsForItem ────────────────────────────────────────────────────────

    @Test
    void getBidsForItem_returnsBidsOrderedByAmount() {
        Bid bid1 = Bid.builder().id(UUID.randomUUID()).item(activeItem).user(buyer)
                .amount(BigDecimal.valueOf(300)).timestamp(OffsetDateTime.now()).build();
        Bid bid2 = Bid.builder().id(UUID.randomUUID()).item(activeItem).user(buyer)
                .amount(BigDecimal.valueOf(500)).timestamp(OffsetDateTime.now()).build();

        when(bidRepository.findByItemIdOrderByAmountDesc(activeItem.getId()))
                .thenReturn(List.of(bid2, bid1));

        List<BidResponse> results = bidService.getBidsForItem(activeItem.getId());

        assertThat(results).hasSize(2);
        assertThat(results.get(0).getAmount()).isEqualByComparingTo(BigDecimal.valueOf(500));
    }

    @Test
    void getBidsForItem_noResults_returnsEmpty() {
        when(bidRepository.findByItemIdOrderByAmountDesc(activeItem.getId())).thenReturn(List.of());

        assertThat(bidService.getBidsForItem(activeItem.getId())).isEmpty();
    }
}
