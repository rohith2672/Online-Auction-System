package com.auction.system.controller;

import com.auction.system.dto.ItemRequest;
import com.auction.system.dto.ItemResponse;
import com.auction.system.service.AuctionItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
public class AuctionItemController {

    private final AuctionItemService itemService;

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ItemResponse> createItem(@RequestBody ItemRequest request) {
        return ResponseEntity.ok(itemService.createItem(request));
    }

    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAllActiveItems() {
        return ResponseEntity.ok(itemService.getAllActiveItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable UUID id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }
}
