package io.inji.verify.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import io.inji.verify.shared.Constants;
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

import java.util.List;

@Table(name = "presentation_definition")
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

    private String name;

    private String purpose;


    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private final List<SubmissionRequirementDto> submissionRequirements;

    @JsonIgnore
    public String getURL(){
        return Constants.VP_DEFINITION_URI +this.id;
    }

}