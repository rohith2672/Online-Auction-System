package com.auction.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemRequest {
    private String name;
    private String description;
    private BigDecimal startingPrice;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private String imageUrl;
}
