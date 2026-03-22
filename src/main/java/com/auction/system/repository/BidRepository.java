package com.auction.system.repository;

import com.auction.system.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BidRepository extends JpaRepository<Bid, UUID> {
    List<Bid> findByItemIdOrderByAmountDesc(UUID itemId);
    List<Bid> findByUserIdOrderByTimestampDesc(UUID userId);
}
