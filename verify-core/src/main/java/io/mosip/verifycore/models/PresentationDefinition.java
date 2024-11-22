package io.mosip.verifycore.models;

import io.mosip.verifycore.dto.presentation.InputDescriptorDto;
import io.mosip.verifycore.dto.presentation.SubmissionRequirementDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.net.URI;
import java.util.List;

@Table(name = "presentations")
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class PresentationDefinition {
    @Id
    private final String id;

    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private final List<InputDescriptorDto> inputDescriptors;

    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private final List<SubmissionRequirementDto> submissionRequirements;


    public URI getURL(String serverURL){
        return URI.create(serverURL+"/vp-definition/"+this.id);
    }
}
