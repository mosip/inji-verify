package io.inji.verify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EntityScan("io.inji.verify")
@EnableCaching
public class VerifyServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(VerifyServiceApplication.class, args);
    }
}
