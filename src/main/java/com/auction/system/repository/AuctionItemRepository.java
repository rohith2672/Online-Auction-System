package com.auction.system.repository;

import com.auction.system.model.AuctionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuctionItemRepository extends JpaRepository<AuctionItem, UUID> {
    List<AuctionItem> findByStatus(AuctionItem.Status status);
    List<AuctionItem> findBySellerId(UUID sellerId);
    List<AuctionItem> findByEndTimeBeforeAndStatus(OffsetDateTime time, AuctionItem.Status status);
}
