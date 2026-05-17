package com.auction.system.service;

import com.auction.system.dto.ItemRequest;
import com.auction.system.dto.ItemResponse;
import com.auction.system.model.AuctionItem;
import com.auction.system.model.User;
import com.auction.system.repository.AuctionItemRepository;
import com.auction.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuctionItemService {

    private final AuctionItemRepository itemRepository;
    private final UserRepository userRepository;

    @Transactional
    public ItemResponse createItem(ItemRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (seller.getRole() != User.Role.SELLER) {
            throw new IllegalArgumentException("Only sellers can create auction items");
        }

        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }
        if (request.getEndTime().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("End time must be in the future");
        }

        AuctionItem item = AuctionItem.builder()
                .seller(seller)
                .name(request.getName())
                .description(request.getDescription())
                .startingPrice(request.getStartingPrice())
                .currentPrice(request.getStartingPrice())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .imageUrl(request.getImageUrl())
                .status(AuctionItem.Status.ACTIVE)
                .build();

        AuctionItem savedItem = itemRepository.save(item);
        return mapToResponse(savedItem);
    }

    public List<ItemResponse> getAllActiveItems() {
        return itemRepository.findByStatus(AuctionItem.Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ItemResponse> getMyItems() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return itemRepository.findBySellerId(seller.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ItemResponse getItemById(UUID id) {
        return itemRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
    }

    private ItemResponse mapToResponse(AuctionItem item) {
        return ItemResponse.builder()
                .id(item.getId())
                .sellerId(item.getSeller().getId())
                .sellerUsername(item.getSeller().getUsername())
                .name(item.getName())
                .description(item.getDescription())
                .startingPrice(item.getStartingPrice())
                .currentPrice(item.getCurrentPrice())
                .startTime(item.getStartTime())
                .endTime(item.getEndTime())
                .imageUrl(item.getImageUrl())
                .status(item.getStatus())
                .build();
    }
}
