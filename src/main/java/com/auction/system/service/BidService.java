package com.auction.system.service;

import com.auction.system.dto.BidRequest;
import com.auction.system.dto.BidResponse;
import com.auction.system.model.AuctionItem;
import com.auction.system.model.Bid;
import com.auction.system.model.User;
import com.auction.system.repository.AuctionItemRepository;
import com.auction.system.repository.BidRepository;
import com.auction.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionItemRepository itemRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public BidResponse placeBid(BidRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRole() != User.Role.USER) {
            throw new IllegalArgumentException("Only standard users can place bids");
        }

        // Pessimistic lock prevents concurrent bids from racing on the same item
        AuctionItem item = itemRepository.findByIdForUpdate(request.getItemId())
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        if (item.getStatus() != AuctionItem.Status.ACTIVE) {
            throw new IllegalArgumentException("Auction is not active");
        }

        if (OffsetDateTime.now().isAfter(item.getEndTime())) {
            throw new IllegalArgumentException("Auction has ended");
        }

        if (request.getAmount().compareTo(item.getCurrentPrice()) <= 0) {
            throw new IllegalArgumentException("Bid amount must be higher than the current price");
        }

        if (user.getCredits().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient credits. Please add credits to your wallet.");
        }

        // Deduct credits before saving the bid
        user.setCredits(user.getCredits().subtract(request.getAmount()));
        userRepository.save(user);

        Bid bid = Bid.builder()
                .item(item)
                .user(user)
                .amount(request.getAmount())
                .build();
        Bid savedBid = bidRepository.save(bid);

        item.setCurrentPrice(request.getAmount());
        itemRepository.save(item);

        log.info("Bid placed: user={} item={} amount={}", username, item.getId(), request.getAmount());

        BidResponse response = mapToResponse(savedBid);
        messagingTemplate.convertAndSend("/topic/bids/" + item.getId(), response);

        return response;
    }

    public List<BidResponse> getBidsForItem(UUID itemId) {
        return bidRepository.findByItemIdOrderByAmountDesc(itemId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private BidResponse mapToResponse(Bid bid) {
        return BidResponse.builder()
                .id(bid.getId())
                .itemId(bid.getItem().getId())
                .userId(bid.getUser().getId())
                .username(bid.getUser().getUsername())
                .amount(bid.getAmount())
                .timestamp(bid.getTimestamp())
                .build();
    }
}
