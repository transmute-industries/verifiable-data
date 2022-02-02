const credential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://credreg.net/ctdlasn/schema/context/json"
  ],
  type: ["VerifiableCredential"],
  issuer: "did:key:z6MkrzF2k2dxeDDGwMWNXK7sTcCvdjFaabHe5NXWWppjACck",
  issuanceDate: "2022-02-01T15:54:58Z",
  credentialSubject: {
    id: "did:key:z6MkfwmZep5ZvkHfeXszxhxEuvkmGFRc8H9Nv9ZaQG4vhFzZ",
    "schema:hasCredential": {
      type: "ceterms:MicroCredential",
      "ceterms:name": "Ogi ogi",
      "ceterms:description": "This is a proof that things work!",
      "ceterms:relatedAction": {
        type: "ceterms:CredentialingAction",
        "ceterms:startDate": "2022-02-01T14:54:55.056Z",
        "ceterms:endDate": "2022-02-03T14:54:55.056Z"
      },
      "ceterms:subject": [
        {
          type: "ceterms:CredentialAlignmentObject",
          "ceterms:targetNodeName": {
            "en-US": "Making sure you know Javascript"
          }
        }
      ]
    }
  },
  proof: {
    type: "Ed25519Signature2018",
    created: "2022-02-01T14:54:58Z",
    verificationMethod:
      "did:key:z6MkrzF2k2dxeDDGwMWNXK7sTcCvdjFaabHe5NXWWppjACck#z6MkrzF2k2dxeDDGwMWNXK7sTcCvdjFaabHe5NXWWppjACck",
    proofPurpose: "assertionMethod",
    jws:
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..oDYsPAjhF8ky7dnSwHUXGRnhkSmPrNrqOp2wm2mT8nbAb8baEhWrO44hT0XmoiZZOCxtanbWuUSlHb0uM-dqCA"
  }
};

const creg = {
  "@context": {
    asn: "http://purl.org/ASN/schema/core/",
    asnPublicationStatus: "http://purl.org/asn/scheme/ASNPublicationStatus/",
    asnscheme: "http://purl.org/asn/scheme/",
    case: "https://purl.imsglobal.org/spec/case/",
    ceasn: "https://purl.org/ctdlasn/terms/",
    ceterms: "https://purl.org/ctdl/terms/",
    cs: "http://vocab.org/changeset/schema#",
    dc: "http://purl.org/dc/elements/1.1/",
    dct: "http://purl.org/dc/terms/",
    gem: "http://purl.org/gem/elements/",
    gemq: "http://purl.org/gem/qualifiers/",
    loc: "http://www.loc.gov/loc.terms/",
    locr: "http://www.loc.gov/loc.terms/relators/",
    meta: "http://credreg.net/meta/terms/",
    publicationStatus: "http://purl.org/ctdlasn/vocabs/publicationStatus/",
    qdata: "https://credreg.net/qdata/terms/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    schema: "https://schema.org/",
    skos: "http://www.w3.org/2004/02/skos/core#",
    vs: "https://www.w3.org/2003/06/sw-vocab-status/ns#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    "asn:hasProgressionLevel": {
      "@type": "@id"
    },
    "asn:hasProgressionModel": {
      "@type": "@id"
    },
    "ceasn:abilityEmbodied": {
      "@type": "@id"
    },
    "ceasn:alignFrom": {
      "@type": "@id"
    },
    "ceasn:alignTo": {
      "@type": "@id"
    },
    "ceasn:altCodedNotation": {
      "@type": "@id"
    },
    "ceasn:author": {
      "@type": "@id"
    },
    "ceasn:broadAlignment": {
      "@type": "@id"
    },
    "ceasn:codedNotation": {
      "@type": "@id"
    },
    "ceasn:comment": {
      "@container": "@language"
    },
    "ceasn:competencyCategory": {
      "@container": "@language"
    },
    "ceasn:competencyLabel": {
      "@container": "@language"
    },
    "ceasn:competencyText": {
      "@container": "@language"
    },
    "ceasn:complexityLevel": {
      "@type": "@id"
    },
    "ceasn:comprisedOf": {
      "@type": "@id"
    },
    "ceasn:conceptKeyword": {
      "@container": "@language"
    },
    "ceasn:conceptTerm": {
      "@type": "@id"
    },
    "ceasn:creator": {
      "@type": "@id"
    },
    "ceasn:crossSubjectReference": {
      "@type": "@id"
    },
    "ceasn:dateCopyrighted": {
      "@type": "@id"
    },
    "ceasn:dateCreated": {
      "@type": "@id"
    },
    "ceasn:dateModified": {
      "@type": "@id"
    },
    "ceasn:dateValidFrom": {
      "@type": "@id"
    },
    "ceasn:dateValidUntil": {
      "@type": "@id"
    },
    "ceasn:derivedFrom": {
      "@type": "@id"
    },
    "ceasn:description": {
      "@container": "@language"
    },
    "ceasn:educationLevelType": {
      "@type": "@id"
    },
    "ceasn:exactAlignment": {
      "@type": "@id"
    },
    "ceasn:hasChild": {
      "@type": "@id",
      "@container": "@list"
    },
    "ceasn:hasTopChild": {
      "@type": "@id",
      "@container": "@list"
    },
    "ceasn:identifier": {
      "@type": "@id"
    },
    "ceasn:inferredCompetency": {
      "@type": "@id"
    },
    "ceasn:inLanguage": {
      "@type": "@id"
    },
    "ceasn:isChildOf": {
      "@type": "@id"
    },
    "ceasn:isPartOf": {
      "@type": "@id"
    },
    "ceasn:isTopChildOf": {
      "@type": "@id"
    },
    "ceasn:isVersionOf": {
      "@type": "@id"
    },
    "ceasn:knowledgeEmbodied": {
      "@type": "@id"
    },
    "ceasn:license": {
      "@type": "@id"
    },
    "ceasn:listID": {
      "@type": "@id"
    },
    "ceasn:localSubject": {
      "@container": "@language"
    },
    "ceasn:majorAlignment": {
      "@type": "@id"
    },
    "ceasn:minorAlignment": {
      "@type": "@id"
    },
    "ceasn:name": {
      "@container": "@language"
    },
    "ceasn:narrowAlignment": {
      "@type": "@id"
    },
    "ceasn:prerequisiteAlignment": {
      "@type": "@id"
    },
    "ceasn:publicationStatusType": {
      "@type": "@id"
    },
    "ceasn:publisher": {
      "@type": "@id"
    },
    "ceasn:publisherName": {
      "@container": "@language"
    },
    "ceasn:repositoryDate": {
      "@type": "@id"
    },
    "ceasn:rights": {
      "@container": "@language"
    },
    "ceasn:rightsHolder": {
      "@type": "@id"
    },
    "ceasn:shouldIndex": {
      "@type": "@id"
    },
    "ceasn:skillEmbodied": {
      "@type": "@id"
    },
    "ceasn:source": {
      "@type": "@id"
    },
    "ceasn:sourceDocumentation": {
      "@type": "@id"
    },
    "ceasn:substantiatingCompetencyFramework": {
      "@type": "@id"
    },
    "ceasn:substantiatingCredential": {
      "@type": "@id"
    },
    "ceasn:substantiatingJob": {
      "@type": "@id"
    },
    "ceasn:substantiatingOccupation": {
      "@type": "@id"
    },
    "ceasn:substantiatingOrganization": {
      "@type": "@id"
    },
    "ceasn:substantiatingResource": {
      "@type": "@id"
    },
    "ceasn:substantiatingTask": {
      "@type": "@id"
    },
    "ceasn:substantiatingWorkRole": {
      "@type": "@id"
    },
    "ceasn:tableOfContents": {
      "@container": "@language"
    },
    "ceasn:taskEmbodied": {
      "@type": "@id"
    },
    "ceasn:weight": {
      "@type": "@id"
    },
    "ceterms:ctid": {
      "@type": "@id"
    },
    "ceterms:industryType": {
      "@type": "@id"
    },
    "ceterms:instructionalProgramType": {
      "@type": "@id"
    },
    "ceterms:occupationType": {
      "@type": "@id"
    },
    "skos:altLabel": {
      "@container": "@language"
    },
    "skos:broader": {
      "@type": "@id"
    },
    "skos:broadMatch": {
      "@type": "@id"
    },
    "skos:changeNote": {
      "@container": "@language"
    },
    "skos:closeMatch": {
      "@type": "@id"
    },
    "skos:definition": {
      "@container": "@language"
    },
    "skos:exactMatch": {
      "@type": "@id"
    },
    "skos:hasTopConcept": {
      "@type": "@id",
      "@container": "@list"
    },
    "skos:hiddenLabel": {
      "@container": "@language"
    },
    "skos:inScheme": {
      "@type": "@id"
    },
    "skos:narrower": {
      "@type": "@id",
      "@container": "@list"
    },
    "skos:narrowMatch": {
      "@type": "@id"
    },
    "skos:notation": {
      "@type": "@id"
    },
    "skos:note": {
      "@container": "@language"
    },
    "skos:prefLabel": {
      "@container": "@language"
    },
    "skos:related": {
      "@type": "@id"
    },
    "skos:topConceptOf": {
      "@type": "@id"
    },
    "ceterms:administrationProcess": {
      "@type": "@id"
    },
    "ceterms:description": {
      "@container": "@language"
    },
    "ceterms:earnings": {
      "@type": "@id"
    },
    "ceterms:employmentOutcome": {
      "@type": "@id"
    },
    "ceterms:endDate": {
      "@type": "@id"
    },
    "ceterms:externalInputType": {
      "@type": "@id"
    },
    "ceterms:geoURI": {
      "@type": "@id"
    },
    "ceterms:jurisdiction": {
      "@type": "@id"
    },
    "ceterms:jurisdictionException": {
      "@type": "@id"
    },
    "ceterms:latitude": {
      "@type": "@id"
    },
    "ceterms:longitude": {
      "@type": "@id"
    },
    "ceterms:mainJurisdiction": {
      "@type": "@id"
    },
    "ceterms:name": {
      "@container": "@language"
    },
    "ceterms:processFrequency": {
      "@container": "@language"
    },
    "ceterms:processingAgent": {
      "@type": "@id"
    },
    "ceterms:processMethod": {
      "@type": "@id"
    },
    "ceterms:processMethodDescription": {
      "@container": "@language"
    },
    "ceterms:source": {
      "@type": "@id"
    },
    "ceterms:startDate": {
      "@type": "@id"
    },
    "ceterms:verificationMethodDescription": {
      "@container": "@language"
    },
    "qdata:adjustment": {
      "@container": "@language"
    },
    "qdata:administrativeRecordType": {
      "@type": "@id"
    },
    "qdata:dataAttributes": {
      "@type": "@id"
    },
    "qdata:dataAvailable": {
      "@type": "@id"
    },
    "qdata:dataCollectionMethodType": {
      "@type": "@id"
    },
    "qdata:dataNotAvailable": {
      "@type": "@id"
    },
    "qdata:dataProvider": {
      "@type": "@id"
    },
    "qdata:dataSetTimePeriod": {
      "@type": "@id"
    },
    "qdata:dataSourceCoverageType": {
      "@type": "@id"
    },
    "qdata:dataSuppressionPolicy": {
      "@container": "@language"
    },
    "qdata:dataWithholdingType": {
      "@type": "@id"
    },
    "qdata:demographicEarningsRate": {
      "@type": "@id"
    },
    "qdata:demographicEmploymentRate": {
      "@type": "@id"
    },
    "qdata:distributionFile": {
      "@type": "@id"
    },
    "qdata:earningsAmount": {
      "@type": "@id"
    },
    "qdata:earningsDefinition": {
      "@container": "@language"
    },
    "qdata:earningsDistribution": {
      "@type": "@id"
    },
    "qdata:earningsThreshold": {
      "@container": "@language"
    },
    "qdata:employmentDefinition": {
      "@container": "@language"
    },
    "qdata:employmentOutlook": {
      "@type": "@id"
    },
    "qdata:employmentRate": {
      "@type": "@id"
    },
    "qdata:holdersInSet": {
      "@type": "@id"
    },
    "qdata:incomeDeterminationType": {
      "@type": "@id"
    },
    "qdata:industryRate": {
      "@type": "@id"
    },
    "qdata:insufficientEmploymentCriteria": {
      "@type": "@id"
    },
    "qdata:median": {
      "@type": "@id"
    },
    "qdata:meetEmploymentCriteria": {
      "@type": "@id"
    },
    "qdata:nonCompleters": {
      "@type": "@id"
    },
    "qdata:nonHoldersInSet": {
      "@type": "@id"
    },
    "qdata:occupationRate": {
      "@type": "@id"
    },
    "qdata:passRate": {
      "@type": "@id"
    },
    "qdata:percentage": {
      "@type": "@id"
    },
    "qdata:percentile10": {
      "@type": "@id"
    },
    "qdata:percentile25": {
      "@type": "@id"
    },
    "qdata:percentile75": {
      "@type": "@id"
    },
    "qdata:percentile90": {
      "@type": "@id"
    },
    "qdata:regionalEarningsDistribution": {
      "@type": "@id"
    },
    "qdata:regionalEmploymentRate": {
      "@type": "@id"
    },
    "qdata:relatedEmployment": {
      "@type": "@id"
    },
    "qdata:relevantDataSet": {
      "@type": "@id"
    },
    "qdata:relevantDataSetFor": {
      "@type": "@id"
    },
    "qdata:subjectExcluded": {
      "@type": "@id"
    },
    "qdata:subjectIdentification": {
      "@container": "@language"
    },
    "qdata:subjectsInSet": {
      "@type": "@id"
    },
    "qdata:subjectType": {
      "@type": "@id"
    },
    "qdata:subjectValue": {
      "@type": "@id"
    },
    "qdata:sufficientEmploymentCriteria": {
      "@type": "@id"
    },
    "qdata:totalWIOACompleters": {
      "@type": "@id"
    },
    "qdata:totalWIOAExiters": {
      "@type": "@id"
    },
    "qdata:totalWIOAParticipants": {
      "@type": "@id"
    },
    "qdata:unrelatedEmployment": {
      "@type": "@id"
    },
    "qdata:workTimeThreshold": {
      "@container": "@language"
    },
    "schema:about": {
      "@type": "@id"
    },
    "schema:currency": {
      "@type": "@id"
    },
    "schema:description": {
      "@container": "@language"
    },
    "schema:maxValue": {
      "@type": "@id"
    },
    "schema:minValue": {
      "@type": "@id"
    },
    "schema:unitText": {
      "@type": "@id"
    },
    "schema:value": {
      "@type": "@id"
    },
    "meta:domainFor": {
      "@type": "@id"
    },
    "meta:hasChangeSet": {
      "@type": "@id"
    },
    "meta:hasConcept": {
      "@type": "@id"
    },
    "meta:objectText": {
      "@container": "@language"
    },
    "meta:supersededBy": {
      "@type": "@id"
    },
    "meta:targetScheme": {
      "@type": "@id"
    },
    "ceterms:accreditedBy": {
      "@type": "@id"
    },
    "ceterms:accreditedIn": {
      "@type": "@id"
    },
    "ceterms:accredits": {
      "@type": "@id"
    },
    "ceterms:actingAgent": {
      "@type": "@id"
    },
    "ceterms:actionStatusType": {
      "@type": "@id"
    },
    "ceterms:address": {
      "@type": "@id"
    },
    "ceterms:addressCountry": {
      "@container": "@language"
    },
    "ceterms:addressLocality": {
      "@container": "@language"
    },
    "ceterms:addressRegion": {
      "@container": "@language"
    },
    "ceterms:advancedStandingFrom": {
      "@type": "@id"
    },
    "ceterms:affiliatedAgent": {
      "@type": "@id"
    },
    "ceterms:affiliation": {
      "@type": "@id"
    },
    "ceterms:agent": {
      "@type": "@id"
    },
    "ceterms:agentPurpose": {
      "@type": "@id"
    },
    "ceterms:agentPurposeDescription": {
      "@container": "@language"
    },
    "ceterms:agentSectorType": {
      "@type": "@id"
    },
    "ceterms:agentType": {
      "@type": "@id"
    },
    "ceterms:aggregateData": {
      "@type": "@id"
    },
    "ceterms:alignmentDate": {
      "@type": "@id"
    },
    "ceterms:alignmentType": {
      "@type": "@id"
    },
    "ceterms:alternateName": {
      "@container": "@language"
    },
    "ceterms:alternativeCondition": {
      "@type": "@id"
    },
    "ceterms:alternativeRuleSet": {
      "@type": "@id"
    },
    "ceterms:appealProcess": {
      "@type": "@id"
    },
    "ceterms:approvedBy": {
      "@type": "@id"
    },
    "ceterms:approvedIn": {
      "@type": "@id"
    },
    "ceterms:approves": {
      "@type": "@id"
    },
    "ceterms:assertedBy": {
      "@type": "@id"
    },
    "ceterms:assesses": {
      "@type": "@id"
    },
    "ceterms:assessmentDeliveryType": {
      "@type": "@id"
    },
    "ceterms:assessmentExample": {
      "@type": "@id"
    },
    "ceterms:assessmentExampleDescription": {
      "@container": "@language"
    },
    "ceterms:assessmentMethodDescription": {
      "@container": "@language"
    },
    "ceterms:assessmentMethodType": {
      "@type": "@id"
    },
    "ceterms:assessmentOutput": {
      "@container": "@language"
    },
    "ceterms:assessmentProfiled": {
      "@type": "@id"
    },
    "ceterms:assessmentUseType": {
      "@type": "@id"
    },
    "ceterms:audienceLevelType": {
      "@type": "@id"
    },
    "ceterms:audienceType": {
      "@type": "@id"
    },
    "ceterms:availabilityListing": {
      "@type": "@id"
    },
    "ceterms:availableAt": {
      "@type": "@id"
    },
    "ceterms:availableOnlineAt": {
      "@type": "@id"
    },
    "ceterms:broadAlignment": {
      "@type": "@id"
    },
    "ceterms:classification": {
      "@type": "@id"
    },
    "ceterms:codedNotation": {
      "@type": "@id"
    },
    "ceterms:commonConditions": {
      "@type": "@id"
    },
    "ceterms:commonCosts": {
      "@type": "@id"
    },
    "ceterms:complaintProcess": {
      "@type": "@id"
    },
    "ceterms:componentCategory": {
      "@container": "@language"
    },
    "ceterms:componentDesignation": {
      "@type": "@id"
    },
    "ceterms:condition": {
      "@container": "@language"
    },
    "ceterms:conditionManifestOf": {
      "@type": "@id"
    },
    "ceterms:conditionProfiled": {
      "@type": "@id"
    },
    "ceterms:contactPoint": {
      "@type": "@id"
    },
    "ceterms:contactType": {
      "@container": "@language"
    },
    "ceterms:copyrightHolder": {
      "@type": "@id"
    },
    "ceterms:corequisite": {
      "@type": "@id"
    },
    "ceterms:costDetails": {
      "@type": "@id"
    },
    "ceterms:costManifestOf": {
      "@type": "@id"
    },
    "ceterms:credentialAlignment": {
      "@type": "@id"
    },
    "ceterms:credentialId": {
      "@type": "@id"
    },
    "ceterms:credentialingAction": {
      "@type": "@id"
    },
    "ceterms:credentialProfiled": {
      "@type": "@id"
    },
    "ceterms:credentialStatusType": {
      "@type": "@id"
    },
    "ceterms:credentialType": {
      "@type": "@id"
    },
    "ceterms:creditLevelType": {
      "@type": "@id"
    },
    "ceterms:creditUnitType": {
      "@type": "@id"
    },
    "ceterms:creditUnitTypeDescription": {
      "@container": "@language"
    },
    "ceterms:creditValue": {
      "@type": "@id"
    },
    "ceterms:currency": {
      "@type": "@id"
    },
    "ceterms:dateEffective": {
      "@type": "@id"
    },
    "ceterms:degreeConcentration": {
      "@type": "@id"
    },
    "ceterms:degreeMajor": {
      "@type": "@id"
    },
    "ceterms:degreeMinor": {
      "@type": "@id"
    },
    "ceterms:deliveryType": {
      "@type": "@id"
    },
    "ceterms:deliveryTypeDescription": {
      "@container": "@language"
    },
    "ceterms:demographicInformation": {
      "@container": "@language"
    },
    "ceterms:department": {
      "@type": "@id"
    },
    "ceterms:developmentProcess": {
      "@type": "@id"
    },
    "ceterms:directCostType": {
      "@type": "@id"
    },
    "ceterms:duns": {
      "@type": "@id"
    },
    "ceterms:email": {
      "@type": "@id"
    },
    "ceterms:employee": {
      "@type": "@id"
    },
    "ceterms:endTime": {
      "@type": "@id"
    },
    "ceterms:entryCondition": {
      "@type": "@id"
    },
    "ceterms:environmentalHazardType": {
      "@type": "@id"
    },
    "ceterms:estimatedCost": {
      "@type": "@id"
    },
    "ceterms:estimatedDuration": {
      "@type": "@id"
    },
    "ceterms:evidenceOfAction": {
      "@type": "@id"
    },
    "ceterms:exactAlignment": {
      "@type": "@id"
    },
    "ceterms:exactDuration": {
      "@type": "@id"
    },
    "ceterms:experience": {
      "@container": "@language"
    },
    "ceterms:expirationDate": {
      "@type": "@id"
    },
    "ceterms:externalResearch": {
      "@type": "@id"
    },
    "ceterms:familyName": {
      "@container": "@language"
    },
    "ceterms:faxNumber": {
      "@type": "@id"
    },
    "ceterms:fein": {
      "@type": "@id"
    },
    "ceterms:financialAssistance": {
      "@type": "@id"
    },
    "ceterms:financialAssistanceType": {
      "@type": "@id"
    },
    "ceterms:financialAssistanceValue": {
      "@type": "@id"
    },
    "ceterms:foundingDate": {
      "@type": "@id"
    },
    "ceterms:framework": {
      "@type": "@id"
    },
    "ceterms:frameworkName": {
      "@container": "@language"
    },
    "ceterms:givenName": {
      "@container": "@language"
    },
    "ceterms:globalJurisdiction": {
      "@type": "@id"
    },
    "ceterms:hasAlignmentMap": {
      "@type": "@id"
    },
    "ceterms:hasCondition": {
      "@type": "@id"
    },
    "ceterms:hasConditionManifest": {
      "@type": "@id"
    },
    "ceterms:hasCostManifest": {
      "@type": "@id"
    },
    "ceterms:hasDestinationComponent": {
      "@type": "@id"
    },
    "ceterms:hasGroupEvaluation": {
      "@type": "@id"
    },
    "ceterms:hasGroupParticipation": {
      "@type": "@id"
    },
    "ceterms:hasJob": {
      "@type": "@id"
    },
    "ceterms:hasMember": {
      "@type": "@id"
    },
    "ceterms:hasOccupation": {
      "@type": "@id"
    },
    "ceterms:hasPart": {
      "@type": "@id"
    },
    "ceterms:hasPathway": {
      "@type": "@id"
    },
    "ceterms:hasSpecialization": {
      "@type": "@id"
    },
    "ceterms:hasStatement": {
      "@type": "@id"
    },
    "ceterms:hasTask": {
      "@type": "@id"
    },
    "ceterms:hasVerificationService": {
      "@type": "@id"
    },
    "ceterms:hasWorkforceDemand": {
      "@type": "@id"
    },
    "ceterms:hasWorkRole": {
      "@type": "@id"
    },
    "ceterms:highEarnings": {
      "@type": "@id"
    },
    "ceterms:holderMustAuthorize": {
      "@type": "@id"
    },
    "ceterms:holders": {
      "@type": "@id"
    },
    "ceterms:honorificSuffix": {
      "@container": "@language"
    },
    "ceterms:identifier": {
      "@type": "@id"
    },
    "ceterms:identifierType": {
      "@type": "@id"
    },
    "ceterms:identifierTypeName": {
      "@container": "@language"
    },
    "ceterms:identifierValueCode": {
      "@type": "@id"
    },
    "ceterms:image": {
      "@type": "@id"
    },
    "ceterms:inAlignmentMap": {
      "@type": "@id"
    },
    "ceterms:inDemandAction": {
      "@type": "@id"
    },
    "ceterms:inLanguage": {
      "@type": "@id"
    },
    "ceterms:instrument": {
      "@type": "@id"
    },
    "ceterms:intermediaryFor": {
      "@type": "@id"
    },
    "ceterms:ipedsID": {
      "@type": "@id"
    },
    "ceterms:isAdvancedStandingFor": {
      "@type": "@id"
    },
    "ceterms:isDestinationComponentOf": {
      "@type": "@id"
    },
    "ceterms:isicV4": {
      "@type": "@id"
    },
    "ceterms:isMemberOf": {
      "@type": "@id"
    },
    "ceterms:isPartOf": {
      "@type": "@id"
    },
    "ceterms:isPreparationFor": {
      "@type": "@id"
    },
    "ceterms:isProctored": {
      "@type": "@id"
    },
    "ceterms:isRecommendedFor": {
      "@type": "@id"
    },
    "ceterms:isRequiredFor": {
      "@type": "@id"
    },
    "ceterms:isSimilarTo": {
      "@type": "@id"
    },
    "ceterms:isSpecializationOf": {
      "@type": "@id"
    },
    "ceterms:jobsObtained": {
      "@type": "@id"
    },
    "ceterms:keyword": {
      "@container": "@language"
    },
    "ceterms:latestVersion": {
      "@type": "@id"
    },
    "ceterms:learningDeliveryType": {
      "@type": "@id"
    },
    "ceterms:learningMethodDescription": {
      "@container": "@language"
    },
    "ceterms:learningMethodType": {
      "@type": "@id"
    },
    "ceterms:learningOpportunityOffered": {
      "@type": "@id"
    },
    "ceterms:learningOpportunityProfiled": {
      "@type": "@id"
    },
    "ceterms:learningResource": {
      "@type": "@id"
    },
    "ceterms:leiCode": {
      "@type": "@id"
    },
    "ceterms:lifeCycleStatusType": {
      "@type": "@id"
    },
    "ceterms:lowEarnings": {
      "@type": "@id"
    },
    "ceterms:maintenanceProcess": {
      "@type": "@id"
    },
    "ceterms:majorAlignment": {
      "@type": "@id"
    },
    "ceterms:maximumDuration": {
      "@type": "@id"
    },
    "ceterms:medianEarnings": {
      "@type": "@id"
    },
    "ceterms:minimumAge": {
      "@type": "@id"
    },
    "ceterms:minimumDuration": {
      "@type": "@id"
    },
    "ceterms:minorAlignment": {
      "@type": "@id"
    },
    "ceterms:missionAndGoalsStatement": {
      "@type": "@id"
    },
    "ceterms:missionAndGoalsStatementDescription": {
      "@container": "@language"
    },
    "ceterms:naics": {
      "@type": "@id"
    },
    "ceterms:narrowAlignment": {
      "@type": "@id"
    },
    "ceterms:ncesID": {
      "@type": "@id"
    },
    "ceterms:nextVersion": {
      "@type": "@id"
    },
    "ceterms:numberAwarded": {
      "@type": "@id"
    },
    "ceterms:object": {
      "@type": "@id"
    },
    "ceterms:offeredBy": {
      "@type": "@id"
    },
    "ceterms:offeredIn": {
      "@type": "@id"
    },
    "ceterms:offers": {
      "@type": "@id"
    },
    "ceterms:opeID": {
      "@type": "@id"
    },
    "ceterms:ownedBy": {
      "@type": "@id"
    },
    "ceterms:owns": {
      "@type": "@id"
    },
    "ceterms:parentOrganization": {
      "@type": "@id"
    },
    "ceterms:participant": {
      "@type": "@id"
    },
    "ceterms:partOfIdentifierValueSet": {
      "@type": "@id"
    },
    "ceterms:paymentPattern": {
      "@container": "@language"
    },
    "ceterms:performanceLevelType": {
      "@type": "@id"
    },
    "ceterms:physicalCapabilityType": {
      "@type": "@id"
    },
    "ceterms:pointValue": {
      "@type": "@id"
    },
    "ceterms:postalCode": {
      "@type": "@id"
    },
    "ceterms:postOfficeBoxNumber": {
      "@type": "@id"
    },
    "ceterms:postReceiptMonths": {
      "@type": "@id"
    },
    "ceterms:precedes": {
      "@type": "@id"
    },
    "ceterms:preparationFrom": {
      "@type": "@id"
    },
    "ceterms:prerequisite": {
      "@type": "@id"
    },
    "ceterms:previousVersion": {
      "@type": "@id"
    },
    "ceterms:price": {
      "@type": "@id"
    },
    "ceterms:processMethodType": {
      "@type": "@id"
    },
    "ceterms:processStandards": {
      "@type": "@id"
    },
    "ceterms:processStandardsDescription": {
      "@container": "@language"
    },
    "ceterms:programTerm": {
      "@type": "@id"
    },
    "ceterms:proxyFor": {
      "@type": "@id"
    },
    "ceterms:qualityAssuranceTargetType": {
      "@type": "@id"
    },
    "ceterms:recognizedBy": {
      "@type": "@id"
    },
    "ceterms:recognizedIn": {
      "@type": "@id"
    },
    "ceterms:recognizes": {
      "@type": "@id"
    },
    "ceterms:recommends": {
      "@type": "@id"
    },
    "ceterms:region": {
      "@type": "@id"
    },
    "ceterms:regulatedBy": {
      "@type": "@id"
    },
    "ceterms:regulatedIn": {
      "@type": "@id"
    },
    "ceterms:regulates": {
      "@type": "@id"
    },
    "ceterms:relatedAction": {
      "@type": "@id"
    },
    "ceterms:renewal": {
      "@type": "@id"
    },
    "ceterms:renewalFrequency": {
      "@type": "@id"
    },
    "ceterms:renewedBy": {
      "@type": "@id"
    },
    "ceterms:renewedIn": {
      "@type": "@id"
    },
    "ceterms:renews": {
      "@type": "@id"
    },
    "ceterms:requiredNumber": {
      "@type": "@id"
    },
    "ceterms:requires": {
      "@type": "@id"
    },
    "ceterms:residencyType": {
      "@type": "@id"
    },
    "ceterms:residentOf": {
      "@type": "@id"
    },
    "ceterms:result": {
      "@type": "@id"
    },
    "ceterms:resultingAward": {
      "@type": "@id"
    },
    "ceterms:reviewProcess": {
      "@type": "@id"
    },
    "ceterms:revocation": {
      "@type": "@id"
    },
    "ceterms:revocationCriteria": {
      "@type": "@id"
    },
    "ceterms:revocationCriteriaDescription": {
      "@container": "@language"
    },
    "ceterms:revocationProcess": {
      "@type": "@id"
    },
    "ceterms:revokedBy": {
      "@type": "@id"
    },
    "ceterms:revokedIn": {
      "@type": "@id"
    },
    "ceterms:revokes": {
      "@type": "@id"
    },
    "ceterms:ruleSetUsed": {
      "@type": "@id"
    },
    "ceterms:sameAs": {
      "@type": "@id"
    },
    "ceterms:sced": {
      "@type": "@id"
    },
    "ceterms:scoringMethodDescription": {
      "@container": "@language"
    },
    "ceterms:scoringMethodExample": {
      "@type": "@id"
    },
    "ceterms:scoringMethodExampleDescription": {
      "@container": "@language"
    },
    "ceterms:scoringMethodType": {
      "@type": "@id"
    },
    "ceterms:sensoryCapabilityType": {
      "@type": "@id"
    },
    "ceterms:serviceType": {
      "@type": "@id"
    },
    "ceterms:socialMedia": {
      "@type": "@id"
    },
    "ceterms:sourceData": {
      "@type": "@id"
    },
    "ceterms:spatialCoverage": {
      "@type": "@id"
    },
    "ceterms:startTime": {
      "@type": "@id"
    },
    "ceterms:streetAddress": {
      "@container": "@language"
    },
    "ceterms:subject": {
      "@type": "@id"
    },
    "ceterms:subjectWebpage": {
      "@type": "@id"
    },
    "ceterms:submissionOf": {
      "@type": "@id"
    },
    "ceterms:submissionOfDescription": {
      "@container": "@language"
    },
    "ceterms:subOrganization": {
      "@type": "@id"
    },
    "ceterms:supersededBy": {
      "@type": "@id"
    },
    "ceterms:supersedes": {
      "@type": "@id"
    },
    "ceterms:targetAssessment": {
      "@type": "@id"
    },
    "ceterms:targetCompetency": {
      "@type": "@id"
    },
    "ceterms:targetCompetencyFramework": {
      "@type": "@id"
    },
    "ceterms:targetComponent": {
      "@type": "@id"
    },
    "ceterms:targetContactPoint": {
      "@type": "@id"
    },
    "ceterms:targetCredential": {
      "@type": "@id"
    },
    "ceterms:targetLearningOpportunity": {
      "@type": "@id"
    },
    "ceterms:targetLearningResource": {
      "@type": "@id"
    },
    "ceterms:targetNode": {
      "@type": "@id"
    },
    "ceterms:targetNodeDescription": {
      "@container": "@language"
    },
    "ceterms:targetNodeName": {
      "@container": "@language"
    },
    "ceterms:targetPathway": {
      "@type": "@id"
    },
    "ceterms:teaches": {
      "@type": "@id"
    },
    "ceterms:telephone": {
      "@type": "@id"
    },
    "ceterms:temporalCoverage": {
      "@type": "@id"
    },
    "ceterms:trainingOffered": {
      "@type": "@id"
    },
    "ceterms:transferValue": {
      "@type": "@id"
    },
    "ceterms:transferValueFor": {
      "@type": "@id"
    },
    "ceterms:transferValueFrom": {
      "@type": "@id"
    },
    "ceterms:transferValueStatement": {
      "@type": "@id"
    },
    "ceterms:transferValueStatementDescription": {
      "@container": "@language"
    },
    "ceterms:url": {
      "@type": "@id"
    },
    "ceterms:verificationDirectory": {
      "@type": "@id"
    },
    "ceterms:verificationService": {
      "@type": "@id"
    },
    "ceterms:verifiedClaimType": {
      "@type": "@id"
    },
    "ceterms:versionIdentifier": {
      "@type": "@id"
    },
    "ceterms:weight": {
      "@type": "@id"
    },
    "ceterms:worksFor": {
      "@type": "@id"
    },
    "ceterms:yearsOfExperience": {
      "@type": "@id"
    },
    "rdfs:subclassOf": {
      "@type": "@id"
    },
    "owl:equivalentProperty": {
      "@type": "@id"
    },
    "owl:equivalentClass": {
      "@type": "@id"
    },
    "schema:domainIncludes": {
      "@type": "@id"
    },
    "schema:rangeIncludes": {
      "@type": "@id"
    },
    "owl:inverseOf": {
      "@type": "@id"
    },
    "vs:term_status": {
      "@type": "@id"
    },
    "meta:changeHistory": {
      "@type": "@id"
    },
    "skos:relatedMatch": {
      "@type": "@id"
    },
    "rdfs:label": {
      "@container": "@language"
    },
    "rdfs:comment": {
      "@container": "@language"
    },
    "dct:description": {
      "@container": "@language"
    },
    "vann:usageNote": {
      "@container": "@language"
    },
    "skos:historyNote": {
      "@container": "@language"
    }
  }
};