package io.inji.verify.services.impl;

import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.inji.verify.utils.Utils;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.constants.CredentialFormat;
import io.mosip.vercred.vcverifier.data.CredentialVerificationSummary;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.data.VerificationStatus;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.MockedStatic;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class VCVerificationServiceImplTest {

    static VCVerificationServiceImpl service;
    static CredentialsVerifier mockCredentialsVerifier;

    private final String TEST_VC_STRING = "{\"credentialSubject\":{},\"issuanceDate\":\"2025-05-15T11:28:43.522Z\",\"id\":\"https://mosip.io/credential/03f33e23-5e14-4ab9-b04f-1fcda9bda4e8\",\"proof\":{\"proofValue\":\"z5stHPoQFFZqUee63JexXSqmvavpCw8CJhivqCTV1rkkQ9BCoGMbmDH7JcTAgssprAM4EHXttPN3SdAYuBpnfNWBf\",\"created\":\"2025-05-15T11:28:43Z\",\"proofPurpose\":\"assertionMethod\",\"type\":\"Ed25519Signature2020\",\"verificationMethod\":\"did:web:mosip.github.io:inji-config:collab:tan#key-0\"},\"type\":[\"VerifiableCredential\",\"IncomeTaxAccountCredential\"],\"@context\":[\"https://www.w3.org/2018/credentials/v1\",\"https://mosip.github.io/inji-config/contexts/tan-context.json\",\"https://w3id.org/security/suites/ed25519-2020/v1\"],\"issuer\":\"did:web:mosip.github.io:inji-config:collab:tan\",\"expirationDate\":\"2027-05-15T11:28:43.522Z\"}";
    private final String TEST_SDJWT_VC_STRING = "eyJ0eXAiOiJ2YytzZC1qd3QiLCJhbGciOiJFUzI1NiIsIng1YyI6WyJNSUlCNVRDQ0FZdWdBd0lCQWdJUUdVZEYwa0JpUUdEYXdwKzBkQlNTNWpBS0JnZ3Foa2pPUFFRREFqQWRNUTR3REFZRFZRUURFd1ZCYm1sdGJ6RUxNQWtHQTFVRUJoTUNUa3d3SGhjTk1qVXdOREV5TVRReU16TXdXaGNOTWpZd05UQXlNVFF5TXpNd1dqQWhNUkl3RUFZRFZRUURFd2xqY21Wa2J5QmtZM014Q3pBSkJnTlZCQVlUQWs1TU1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRUZYVk5BMGxhYSs1UDJuazVQSkZvdjh4aEJGTno1VU9KQklWc3lrMFNLU2ZxVGZLTUI2UitjRkROaWpkbUJZeXVFYVVnTWd1VWM4aE9Wbm5yZVc5dGhLT0JxRENCcFRBZEJnTlZIUTRFRmdRVVlSOHZGUVRsa2pmMS9ObktlWnh2WTBaejNhQXdEZ1lEVlIwUEFRSC9CQVFEQWdlQU1CVUdBMVVkSlFFQi93UUxNQWtHQnlpQmpGMEZBUUl3SHdZRFZSMGpCQmd3Rm9BVUw5OHdhTll2OVFueElIYjVDRmd4anZaVXRVc3dJUVlEVlIwU0JCb3dHSVlXYUhSMGNITTZMeTltZFc1clpTNWhibWx0Ynk1cFpEQVpCZ05WSFJFRUVqQVFnZzVtZFc1clpTNWhibWx0Ynk1cFpEQUtCZ2dxaGtqT1BRUURBZ05JQURCRkFpQkJ3ZFMvY0ZCczNhd3RmUDlHRlZrZ1NPSVRRZFBCTUxoc0pCeWpnN2wyTFFJaEFQUUpXeTdxUXNmcTJHcmRwY0dYSHJEVkswdy9YblBGMlhBVDZyVFg4dUNQIiwiTUlJQnp6Q0NBWFdnQXdJQkFnSVFWd0FGb2xXUWltOTRnbXlDaWMzYkNUQUtCZ2dxaGtqT1BRUURBakFkTVE0d0RBWURWUVFERXdWQmJtbHRiekVMTUFrR0ExVUVCaE1DVGt3d0hoY05NalF3TlRBeU1UUXlNek13V2hjTk1qZ3dOVEF5TVRReU16TXdXakFkTVE0d0RBWURWUVFERXdWQmJtbHRiekVMTUFrR0ExVUVCaE1DVGt3d1dUQVRCZ2NxaGtqT1BRSUJCZ2dxaGtqT1BRTUJCd05DQUFRQy9ZeUJwY1JRWDhaWHBIZnJhMVROZFNiUzdxemdIWUhKM21zYklyOFRKTFBOWkk4VWw4ekpsRmRRVklWbHM1KzVDbENiTitKOUZVdmhQR3M0QXpBK280R1dNSUdUTUIwR0ExVWREZ1FXQkJRdjN6Qm8xaS8xQ2ZFZ2R2a0lXREdPOWxTMVN6QU9CZ05WSFE4QkFmOEVCQU1DQVFZd0lRWURWUjBTQkJvd0dJWVdhSFIwY0hNNkx5OW1kVzVyWlM1aGJtbHRieTVwWkRBU0JnTlZIUk1CQWY4RUNEQUdBUUgvQWdFQU1Dc0dBMVVkSHdRa01DSXdJS0Flb0J5R0dtaDBkSEJ6T2k4dlpuVnVhMlV1WVc1cGJXOHVhV1F2WTNKc01Bb0dDQ3FHU000OUJBTUNBMGdBTUVVQ0lRQ1RnODBBbXFWSEpMYVp0MnV1aEF0UHFLSVhhZlAyZ2h0ZDlPQ21kRDUxWndJZ0t2VmtyZ1RZbHhTUkFibUtZNk1sa0g4bU0zU05jbkVKazlmR1Z3SkcrKzA9Il19.eyJjcmVkZW50aWFsX3R5cGUiOiJNU0lTRE4iLCJuYmYiOjE3NTI5ODQ3MzcsImV4cCI6MTc4NTM4NDczNywidmN0IjoiZXUuZXVyb3BhLmVjLmV1ZGkubXNpc2RuLjEiLCJjbmYiOnsia2lkIjoiZGlkOmp3azpleUpyZEhraU9pSkZReUlzSW1OeWRpSTZJbEF0TWpVMklpd2llQ0k2SWxKUk5XSkRiMngzUkZKV1pHUjRhbkk1TFUweUxVNUtPRVZ1TjFwSE1tTXpVbkZzVTJKVVR6TlJUMFVpTENKNUlqb2lZVlpFVVZkak5TMUJZbmhIYmxoV2JYRk1WMkphWmpGR1ZsWjFOVEF5TW0xaGFHdHpSVTh3VTJSZmR5SXNJblZ6WlNJNkluTnBaeUo5IzAifSwiaXNzIjoiaHR0cHM6Ly9mdW5rZS5hbmltby5pZCIsImlhdCI6MTc1Mzk0MjUyNywiX3NkIjpbIjI5SXE0b29UNzhGMkI1bFI1RzhGSGhGWWJKWmlER29vRHEySUpicFpCVG8iLCIzZVNTOEtZcUZzQVVHZVhIVWhwU21qd1k2TG5XaVJCMTVXYXRLY0ZTNzhJIiwiNE9mZGdDalZPUTJMbzhESXpTUEpodVVWT25yWGhjX1dkTGpCZDcwRGJFUSIsIkFwMWVweTdtVThiRkdrNXZkWXdlMjZma2pUY2taaW1uMDlncFlSR25XY3ciLCJEU0NWZHY3WklSOEZNNTR4c05MVlZqYndJc0JjcE9EUllHRTlCOTFra19RIiwiRnMwbGVHT0VMUU85ejhYblZsbVJTdXRUX0d3dDRTOWNubUJLcDF4TnRyQSIsIlFTbjl3dUx3LUJKY3VLRF9URHl0NGcyZlR4LU1KcmNyVzM0bVpKdHhtc0kiLCJfZDkyZVNKcW9FemdhQlctcFU2NUY2N3FOUno2Y2owRkJObDJYcTFmRWdFIiwia3VwOXhVUjZYMDZ5X3RiVVBPTzJ4VWxiWHJReG1qalRiVE9zMktYUUM4YyIsInBIYmh1eWxJbkZnaGtPY3hqcHVKb0o0S0hITUhfT2JSOWxYX0ZUa2Vmb2ciLCJ4YW1wZmJkRHJfd05LUllKN1F6NlAxZEZJcGJvMTJFdHRfZkMzYko4MDFvIl0sIl9zZF9hbGciOiJzaGEtMjU2In0.pf3MHMEAma64_-8mfmPdLCNzgzz5K0_EianTPd5IUzMlkXhB1v4NtQmRiARlLvTd9kkUChhW4lascAkW8TOnSA~WyI4NzY3MzA2NTE3OTE1MTMzMTI2NDI5MTUiLCJwaG9uZV9udW1iZXIiLCI0OTE1MTEyMzQ1NjciXQ~WyIyNzgzODk0ODU5Mjc2ODY0NTY1NjkxNzUiLCJyZWdpc3RlcmVkX2ZhbWlseV9uYW1lIiwiTXVzdGVybWFuIl0~WyI5Njk4OTYzODY5MDAwMTE3MzM0MTE0NDQiLCJyZWdpc3RlcmVkX2dpdmVuX25hbWUiLCJKb2huIE1pY2hhZWwiXQ~WyIxMDE3NzAzNzY5OTU2Mzc0MjI4NTIwMDQ4IiwiY29udHJhY3Rfb3duZXIiLHRydWVd~WyIxMTcwMTg2ODQ0MTkyNTczMzQyOTYyNDg5IiwiZW5kX3VzZXIiLGZhbHNlXQ~WyI0MzI1MjkxNDE2MzczOTU0MzgxNDM5NTUiLCJtb2JpbGVfb3BlcmF0b3IiLCJUZWxla29tX0RFIl0~WyI2ODA1NjkyNDQ3MTA1NjQ3ODc1ODQxNzUiLCJpc3N1aW5nX29yZ2FuaXphdGlvbiIsIlRlbE9yZyJd~WyI5MzE5ODU3NzkxNTk0Njc0ODE2NTg4ODciLCJ2ZXJpZmljYXRpb25fZGF0ZSIsIjIwMjMtMDgtMjUiXQ~WyI2MTkxMTk5NjI3Mzg2MDQ5MjI4ODkwMjEiLCJ2ZXJpZmljYXRpb25fbWV0aG9kX2luZm9ybWF0aW9uIiwiTnVtYmVyVmVyaWZ5Il0~WyIzNzM2NzUzNDQwNDA1ODI4Mzc2MTE0MjQiLCJpc3N1YW5jZV9kYXRlIiwiMjAyNS0wNy0yMFQwNDoxMjoxNy4wODlaIl0~WyI1NjU0NDMyNzk2MjEwMjQ2ODk0NjQ3MDgiLCJleHBpcnlfZGF0ZSIsIjIwMjYtMDctMzBUMDQ6MTI6MTcuMDg5WiJd~";
    private final String TEST_TRANSACTION_ID = "txn-12345";

    @BeforeAll
    public static void beforeAll() {
        mockCredentialsVerifier = mock(CredentialsVerifier.class);
        service = new VCVerificationServiceImpl(mockCredentialsVerifier);
    }

    @Test
    public void shouldReturnSuccessForVerifiedVc() {
        CredentialVerificationSummary mockSummary = mock(CredentialVerificationSummary.class);
        VerificationResult mockVerificationResult = mock(VerificationResult.class);
        when(mockSummary.getVerificationResult()).thenReturn(mockVerificationResult);
        when(mockCredentialsVerifier.verifyAndGetCredentialStatus(
                eq(TEST_VC_STRING),
                eq(CredentialFormat.LDP_VC),
                ArgumentMatchers.anyList())
        ).thenReturn(mockSummary);

        try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class, CALLS_REAL_METHODS)) {

            VCVerificationStatusDto statusDto = service.verify(TEST_VC_STRING, "application/ldp+json");
            assertEquals(VerificationStatus.SUCCESS, statusDto.getVerificationStatus());
            verify(mockCredentialsVerifier, times(1))
                    .verifyAndGetCredentialStatus(anyString(), any(CredentialFormat.class), ArgumentMatchers.anyList());
            utilsMock.verify(() -> Utils.getVcVerificationStatus(mockSummary), times(1));
        }
    }

    @Test
    public void shouldReturnExpiredForVerifiedVcWhichIsExpired() {
        CredentialVerificationSummary mockSummary = mock(CredentialVerificationSummary.class);
        when(mockCredentialsVerifier.verifyAndGetCredentialStatus(
                anyString(),
                eq(CredentialFormat.LDP_VC),
                ArgumentMatchers.anyList())
        ).thenReturn(mockSummary);

        try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
            utilsMock.when(() -> Utils.getVcVerificationStatus(mockSummary))
                    .thenReturn(VerificationStatus.EXPIRED);

            VCVerificationStatusDto statusDto = service.verify("some_vc", "application/ldp+json");
            assertEquals(VerificationStatus.EXPIRED, statusDto.getVerificationStatus());
        }
    }

    @Test
    public void shouldReturnInvalidForVcWhichIsInvalid() {
        CredentialVerificationSummary mockSummary = mock(CredentialVerificationSummary.class);
        when(mockCredentialsVerifier.verifyAndGetCredentialStatus(
                anyString(),
                eq(CredentialFormat.LDP_VC),
                ArgumentMatchers.anyList())
        ).thenReturn(mockSummary);

        try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
            utilsMock.when(() -> Utils.getVcVerificationStatus(mockSummary))
                    .thenReturn(VerificationStatus.INVALID);

            VCVerificationStatusDto statusDto = service.verify("some_vc", "application/ldp+json");
            assertEquals(VerificationStatus.INVALID, statusDto.getVerificationStatus());
        }
    }

    @Test
    public void shouldUseLDPFormatForOtherContentTypes() {
        CredentialVerificationSummary mockSummary = mock(CredentialVerificationSummary.class);
        when(mockCredentialsVerifier.verifyAndGetCredentialStatus(
                anyString(),
                eq(CredentialFormat.LDP_VC),
                ArgumentMatchers.anyList())
        ).thenReturn(mockSummary);

        try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
            utilsMock.when(() -> Utils.getVcVerificationStatus(mockSummary))
                    .thenReturn(VerificationStatus.SUCCESS);

            VCVerificationStatusDto statusDto = service.verify("some_vc", "application/other");
            assertEquals(VerificationStatus.SUCCESS, statusDto.getVerificationStatus());
        }
    }

    @Test
    public void shouldReturnRevokedForRevokedVc() {
        CredentialVerificationSummary mockSummary = mock(CredentialVerificationSummary.class);
        when(mockCredentialsVerifier.verifyAndGetCredentialStatus(
                anyString(),
                eq(CredentialFormat.LDP_VC),
                ArgumentMatchers.anyList())
        ).thenReturn(mockSummary);

        try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
            utilsMock.when(() -> Utils.getVcVerificationStatus(mockSummary))
                    .thenReturn(VerificationStatus.REVOKED);

            VCVerificationStatusDto statusDto = service.verify("some_vc", "application/ldp+json");
            assertEquals(VerificationStatus.REVOKED, statusDto.getVerificationStatus());
        }
    }
}
