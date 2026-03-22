package com.auction.system.dto;

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
public class BidResponse {
    private UUID id;
    private UUID itemId;
    private UUID userId;
    private String username;
    private BigDecimal amount;
    private OffsetDateTime timestamp;
}
