package com.auction.system.scheduler;

import com.auction.system.model.AuctionItem;
import com.auction.system.repository.AuctionItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuctionScheduler {

    private final AuctionItemRepository itemRepository;

    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void closeExpiredAuctions() {
        log.info("Checking for expired auctions...");
        OffsetDateTime now = OffsetDateTime.now();
        List<AuctionItem> expiredItems = itemRepository.findByEndTimeBeforeAndStatus(now, AuctionItem.Status.ACTIVE);

        if (!expiredItems.isEmpty()) {
            for (AuctionItem item : expiredItems) {
                item.setStatus(AuctionItem.Status.ENDED);
                log.info("Auction ended for item: {}", item.getId());
            }
            itemRepository.saveAll(expiredItems);
        }
    }
}
