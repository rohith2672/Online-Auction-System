package com.auction.system.service;

import com.auction.system.dto.ItemRequest;
import com.auction.system.dto.ItemResponse;
import com.auction.system.model.AuctionItem;
import com.auction.system.model.User;
import com.auction.system.repository.AuctionItemRepository;
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
class AuctionItemServiceTest {

    @Mock private AuctionItemRepository itemRepository;
    @Mock private UserRepository userRepository;
    @Mock private Authentication authentication;
    @Mock private SecurityContext securityContext;

    @InjectMocks private AuctionItemService auctionItemService;

    private User sellerUser;
    private User regularUser;

    @BeforeEach
    void setUp() {
        sellerUser = User.builder()
                .id(UUID.randomUUID())
                .username("seller1")
                .role(User.Role.SELLER)
                .credits(BigDecimal.valueOf(1000))
                .build();

        regularUser = User.builder()
                .id(UUID.randomUUID())
                .username("buyer1")
                .role(User.Role.USER)
                .credits(BigDecimal.valueOf(500))
                .build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private ItemRequest buildItemRequest() {
        return ItemRequest.builder()
                .name("Vintage Watch")
                .description("A rare vintage watch")
                .startingPrice(BigDecimal.valueOf(100))
                .startTime(OffsetDateTime.now())
                .endTime(OffsetDateTime.now().plusDays(3))
                .imageUrl("http://example.com/watch.jpg")
                .build();
    }

    private AuctionItem buildAuctionItem(User seller, ItemRequest req) {
        return AuctionItem.builder()
                .id(UUID.randomUUID())
                .seller(seller)
                .name(req.getName())
                .description(req.getDescription())
                .startingPrice(req.getStartingPrice())
                .currentPrice(req.getStartingPrice())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .imageUrl(req.getImageUrl())
                .status(AuctionItem.Status.ACTIVE)
                .build();
    }

    // ── createItem ────────────────────────────────────────────────────────────

    @Test
    void createItem_bySeller_success() {
        ItemRequest req = buildItemRequest();
        when(authentication.getName()).thenReturn("seller1");
        when(userRepository.findByUsername("seller1")).thenReturn(Optional.of(sellerUser));
        AuctionItem saved = buildAuctionItem(sellerUser, req);
        when(itemRepository.save(any(AuctionItem.class))).thenReturn(saved);

        ItemResponse response = auctionItemService.createItem(req);

        assertThat(response.getName()).isEqualTo("Vintage Watch");
        assertThat(response.getStatus()).isEqualTo(AuctionItem.Status.ACTIVE);
        assertThat(response.getSellerUsername()).isEqualTo("seller1");
    }

    @Test
    void createItem_byNonSeller_throwsException() {
        ItemRequest req = buildItemRequest();
        when(authentication.getName()).thenReturn("buyer1");
        when(userRepository.findByUsername("buyer1")).thenReturn(Optional.of(regularUser));

        assertThatThrownBy(() -> auctionItemService.createItem(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Only sellers can create auction items");
    }

    @Test
    void createItem_userNotFound_throwsException() {
        ItemRequest req = buildItemRequest();
        when(authentication.getName()).thenReturn("unknown");
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> auctionItemService.createItem(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }

    // ── getAllActiveItems ─────────────────────────────────────────────────────

    @Test
    void getAllActiveItems_returnsOnlyActiveItems() {
        ItemRequest req = buildItemRequest();
        AuctionItem item = buildAuctionItem(sellerUser, req);
        when(itemRepository.findByStatus(AuctionItem.Status.ACTIVE)).thenReturn(List.of(item));

        List<ItemResponse> result = auctionItemService.getAllActiveItems();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(AuctionItem.Status.ACTIVE);
    }

    @Test
    void getAllActiveItems_noItems_returnsEmptyList() {
        when(itemRepository.findByStatus(AuctionItem.Status.ACTIVE)).thenReturn(List.of());

        assertThat(auctionItemService.getAllActiveItems()).isEmpty();
    }

    // ── getItemById ───────────────────────────────────────────────────────────

    @Test
    void getItemById_existingId_returnsItem() {
        ItemRequest req = buildItemRequest();
        AuctionItem item = buildAuctionItem(sellerUser, req);
        when(itemRepository.findById(item.getId())).thenReturn(Optional.of(item));

        ItemResponse response = auctionItemService.getItemById(item.getId());

        assertThat(response.getId()).isEqualTo(item.getId());
        assertThat(response.getName()).isEqualTo("Vintage Watch");
    }

    @Test
    void getItemById_nonExistingId_throwsException() {
        UUID id = UUID.randomUUID();
        when(itemRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> auctionItemService.getItemById(id))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Item not found");
    }
}
