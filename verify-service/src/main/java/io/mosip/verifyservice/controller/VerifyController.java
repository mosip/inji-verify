package io.mosip.verifyservice.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class VerifyController {

    @GetMapping("/request_uri")
    public String verify() {
        return "openid4vp://?request_uri=https://example.com/request-object";
    }

}