package io.inji.verify.controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.inji.verify.services.GoogleSheetService;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class GoogleSheetController {

    @Autowired
    private GoogleSheetService googleSheetService;

    private String generateNextSNo() throws IOException, GeneralSecurityException {
        List<List<Object>> data = googleSheetService.getSheetData("Sheet1!A:E");
        if (data == null || data.isEmpty()) {
            return "1";
        }
    
        int lastSNo = 0;
    
        for (List<Object> row : data) {
            if (row.isEmpty() || row.get(0) == null) continue; // Skip empty rows
    
            try {
                String sNoStr = row.get(0).toString().trim();
                if (!sNoStr.matches("\\d+")) continue;
                
                int currentSNo = Integer.parseInt(sNoStr);
                lastSNo = Math.max(lastSNo, currentSNo);
            } catch (NumberFormatException e) {
                System.err.println("Error parsing s.no (skipping row): " + e.getMessage());
            }
        }
    
        return String.valueOf(lastSNo + 1);
    }
    

    @PostMapping("/append")
    public ResponseEntity<String> appendData(@RequestBody Map<String, Object> rowData) throws GeneralSecurityException {
    
        try {
            List<Object> values = new ArrayList<>();
            values.add(generateNextSNo());
            values.add(rowData.getOrDefault("fullname", ""));
            values.add(rowData.getOrDefault("email", ""));
            values.add(rowData.getOrDefault("mobile", ""));
            Long time = Instant.now().toEpochMilli();
            values.add(time);
    
            List<List<Object>> dataToAppend = new ArrayList<>();
            dataToAppend.add(values);
    
            googleSheetService.appendData(dataToAppend);
            return ResponseEntity.ok("Data appended successfully");
    
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error appending data: " + e.getMessage());
        }
    }

}
