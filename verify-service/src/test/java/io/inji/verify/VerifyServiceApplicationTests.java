package io.inji.verify;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = { "inji.vp-request.long-polling-timeout = 1000" })
class VerifyServiceApplicationTests {

     @Test
     void contextLoads() {
     }

}
