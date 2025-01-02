package io.inji.verify.utils;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

public class ThreadSafeDelayedMethodCall {

    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
    private final AtomicBoolean isScheduled = new AtomicBoolean(false);

    public void scheduleMethod(Runnable task, long delay, TimeUnit unit) {
        if (isScheduled.compareAndSet(false, true)) {
            executor.schedule(() -> {
                try {
                    task.run();
                } finally {
                    isScheduled.set(false);
                }
            }, delay, unit);
        }
    }

    public void shutdown() {
        executor.shutdown();
    }
}