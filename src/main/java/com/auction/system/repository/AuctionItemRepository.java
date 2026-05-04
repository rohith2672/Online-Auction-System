package com.auction.system.repository;

import com.auction.system.model.AuctionItem;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuctionItemRepository extends JpaRepository<AuctionItem, UUID> {
    List<AuctionItem> findByStatus(AuctionItem.Status status);
    List<AuctionItem> findBySellerId(UUID sellerId);
    List<AuctionItem> findByEndTimeBeforeAndStatus(OffsetDateTime time, AuctionItem.Status status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM AuctionItem a WHERE a.id = :id")
    Optional<AuctionItem> findByIdForUpdate(@Param("id") UUID id);
}
