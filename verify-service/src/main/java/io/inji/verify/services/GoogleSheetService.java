package io.inji.verify.services;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GoogleSheetService {

    @Value("${google.credentials.json}")
    private String credentialsJson;

    @Value("${google.sheets.id}")
    private String spreadsheetId;

    private Sheets sheetsService;

    @PostConstruct
    private void initializeSheetsService() throws IOException, GeneralSecurityException {
        System.out.println("Initializing Google Sheets Service...");

        NetHttpTransport httpTransport = new NetHttpTransport();
        JacksonFactory jsonFactory = JacksonFactory.getDefaultInstance();

        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                    new ByteArrayInputStream(credentialsJson.getBytes(StandardCharsets.UTF_8)))
                    .createScoped(Collections.singletonList("https://www.googleapis.com/auth/spreadsheets"));

            sheetsService = new Sheets.Builder(httpTransport, jsonFactory, new HttpCredentialsAdapter(credentials))
                    .setApplicationName("Inji Verify")
                    .build();

            System.out.println("Google Sheets Service initialized successfully");

        } catch (IOException e) {
            log.error("Failed to parse Google credentials JSON", e);
            throw e;
        }
    }

    public void appendData(String range, List<List<Object>> rowData) throws IOException {

        ValueRange body = new ValueRange().setValues(rowData);

        sheetsService.spreadsheets().values()
                .append(spreadsheetId, range, body)
                .setValueInputOption("USER_ENTERED")
                .execute();
    }

    public List<List<Object>> getSheetData(String range) throws IOException {
        ValueRange response = sheetsService.spreadsheets().values()
                .get(spreadsheetId, range)
                .execute();

        return response.getValues();
    }
}
