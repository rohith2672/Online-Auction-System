package com.auction.system.controller;

import com.auction.system.dto.BidRequest;
import com.auction.system.dto.BidResponse;
import com.auction.system.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BidResponse> placeBid(@RequestBody BidRequest request) {
        return ResponseEntity.ok(bidService.placeBid(request));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<BidResponse>> getBidsForItem(@PathVariable UUID itemId) {
        return ResponseEntity.ok(bidService.getBidsForItem(itemId));
    }
}
