package com.auction.system.dto;

import com.auction.system.model.AuctionItem.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemResponse {
    private UUID id;
    private UUID sellerId;
    private String sellerUsername;
    private String name;
    private String description;
    private BigDecimal startingPrice;
    private BigDecimal currentPrice;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private String imageUrl;
    private Status status;
}
