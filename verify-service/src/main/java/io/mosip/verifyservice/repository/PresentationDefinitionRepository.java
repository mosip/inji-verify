package io.mosip.verifyservice.repository;

import io.mosip.verifycore.models.PresentationDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PresentationDefinitionRepository extends JpaRepository<PresentationDefinition, String> { }
