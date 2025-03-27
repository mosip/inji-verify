package io.inji.verify.models;

import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;

@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Table(name = "authorization_request_details")
public class AuthorizationRequestCreateResponse implements Serializable {
    @Id
    private final String requestId;

    @NotNull
    @Column
    private final String transactionId;

    @NotNull
    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    AuthorizationRequestResponseDto authorizationDetails;

    @NotNull
    @Column
    long expiresAt;
}