package io.mosip.verifycore.dto.authorizationRequest;

import io.mosip.verifycore.models.AuthorizationRequestCreateResponse;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class AuthorizationRequestCreateResponseDto {
    String transactionId;
    String requestId;
    AuthorizationRequestDto authorizationDetails;
    long expiresAt;

    public AuthorizationRequestCreateResponseDto(AuthorizationRequestCreateResponse authorizationRequestCreateResponse) {
        this.transactionId = authorizationRequestCreateResponse.getTransactionId();
        this.requestId = authorizationRequestCreateResponse.getRequestId();
        this.authorizationDetails = authorizationRequestCreateResponse.getAuthorizationDetails();
        this.expiresAt = authorizationRequestCreateResponse.getExpiresAt();
    }
}

//@Data
//public class AuthorizationRequestResponse()  {
//    String transactionId;
//    @id
//    private String requestId;
//    AuthorizationRequest authorizationDetails;
//    String expiresAt;
//    PresentationDefinition presentationDefinition;
//
//
//    public AuthorizationRequestResponse(AuthorizationRequestResponseDTO dto) {
//        this.requestId = dto.requestId();
//    }
//}
//
//
//@Repository
//public interface AuthorizationRequestResponseRepository extends JPA<AuthorizationRequestResponse> {
//
//         findByTSortDECgetone()
//}
