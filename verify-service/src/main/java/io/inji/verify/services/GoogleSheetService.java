package io.inji.verify.services;

import java.io.FileInputStream;
import java.io.IOException;
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

@Service
public class GoogleSheetService {

    @Value("${google.credentials.path}")
    private String credentialsFilePath;

    @Value("${google.sheets.id}")
    private String spreadsheetId;

    private Sheets getSheetsService() throws IOException, GeneralSecurityException {
        System.out.println("Initializing Google Sheets Service...");

        NetHttpTransport httpTransport = new NetHttpTransport();
        JacksonFactory jsonFactory = JacksonFactory.getDefaultInstance();

        FileInputStream credentialsStream;
        try {
            credentialsStream = new FileInputStream(credentialsFilePath);
        } catch (IOException e) {
            System.err.println("Error opening credentials file: " + e.getMessage());
            throw e;
        }

        GoogleCredentials credentials;
        try {
            credentials = GoogleCredentials.fromStream(credentialsStream)
                    .createScoped(Collections.singletonList("https://www.googleapis.com/auth/spreadsheets"));

        } catch (IOException e) {
            System.err.println("Error reading credentials file: " + e.getMessage());
            throw e;
        }

        System.out.println("Successfully loaded credentials.");

        HttpCredentialsAdapter httpCredentialsAdapter = new HttpCredentialsAdapter(credentials);

        Sheets service = new Sheets.Builder(httpTransport, jsonFactory, httpCredentialsAdapter)
                .setApplicationName("Inji Verify")
                .build();

        System.out.println("Google Sheets Service initialized successfully.");

        return service;
    }

    public void appendData(List<List<Object>> rowData) throws IOException, GeneralSecurityException {
        Sheets service = getSheetsService();

        ValueRange body = new ValueRange().setValues(rowData);

        service.spreadsheets().values()
                .append(spreadsheetId, "Sheet1!A:E", body)
                .setValueInputOption("USER_ENTERED")
                .execute();

    }

    public List<List<Object>> getSheetData(String range) throws IOException, GeneralSecurityException {
        Sheets service = getSheetsService();

        ValueRange response = service.spreadsheets().values()
                .get(spreadsheetId, range)
                .execute();

        return response.getValues();
    }
}
