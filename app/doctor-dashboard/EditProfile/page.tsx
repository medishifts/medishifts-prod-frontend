"use client";
import { AppDispatch, useAppSelector } from "@/app/redux/store";
import pb from "@/utils/pocketbase-connect";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { stateCityData } from "../../stateCities";
import { deleteCookie, getCookie } from "cookies-next";
import { educationalQualifications } from "../../educationalQualifications";
import EducationalQualificationsTable from "@/components/EducationalQualificationsTable";
import { resetProfile } from "@/app/redux/features/profile-slice";
import { useDispatch } from "react-redux";
import SelectDropDown from "@/components/SelectDropDown";

type Degree = keyof typeof educationalQualifications.degrees; // 'MBBS' | 'BAMS' etc.
type PGCourses =
  keyof (typeof educationalQualifications.degrees)[Degree]["postgraduateCourses"];
type SpecializationCourses = string[];
type DegreeOptions = "Not Applicable" | "MBBS" | "BHMS" | "BAMS" | "BDS";
const typedStateCityData = stateCityData as StateCityData;

type StateCityData = {
  [state: string]: string[];
};

const councilOptions = {
  "Not Applicable": [
    {
      key: "Not Applicable",
      name: "Not Applicable",
    },
  ],
  MBBS: [
    {
      key: "Andhra Pradesh Medical Council (APMC)",
      name: "Andhra Pradesh Medical Council (APMC)",
    },
    {
      key: "Arunachal Pradesh State Medical Council (APSMC)",
      name: "Arunachal Pradesh State Medical Council (APSMC)",
    },
    {
      key: "Assam State Medical Council (ASMC)",
      name: "Assam State Medical Council (ASMC)",
    },
    {
      key: "Bihar State Medical Council (BSMC)",
      name: "Bihar State Medical Council (BSMC)",
    },
    {
      key: "Chhattisgarh State Medical Council (CGMC)",
      name: "Chhattisgarh State Medical Council (CGMC)",
    },
    {
      key: "Delhi Medical Council (DMC)",
      name: "Delhi Medical Council (DMC)",
    },
    {
      key: "Goa Medical Council (GMC)",
      name: "Goa Medical Council (GMC)",
    },
    {
      key: "Gujarat Medical Council (GMC)",
      name: "Gujarat Medical Council (GMC)",
    },
    {
      key: "Haryana State Medical Council (HSMC)",
      name: "Haryana State Medical Council (HSMC)",
    },
    {
      key: "Himachal Pradesh State Medical Council (HPMC)",
      name: "Himachal Pradesh State Medical Council (HPMC)",
    },
    {
      key: "Jammu & Kashmir Medical Council (JKMC)",
      name: "Jammu & Kashmir Medical Council (JKMC)",
    },
    {
      key: "Jharkhand State Medical Council (JSMC)",
      name: "Jharkhand State Medical Council (JSMC)",
    },
    {
      key: "Karnataka Medical Council (KMC)",
      name: "Karnataka Medical Council (KMC)",
    },
    {
      key: "Kerala Medical Council (TCMC)",
      name: "Kerala Medical Council (TCMC)",
    },
    {
      key: "Madhya Pradesh Medical Council (MPMC)",
      name: "Madhya Pradesh Medical Council (MPMC)",
    },
    {
      key: "Maharashtra Medical Council (MMC)",
      name: "Maharashtra Medical Council (MMC)",
    },
    {
      key: "Manipur State Medical Council (MSMC)",
      name: "Manipur State Medical Council (MSMC)",
    },
    {
      key: "Meghalaya State Medical Council (MGMC)",
      name: "Meghalaya State Medical Council (MGMC)",
    },
    {
      key: "Mizoram Medical Council (MMC)",
      name: "Mizoram Medical Council (MMC)",
    },
    {
      key: "Nagaland Medical Council (NMC)",
      name: "Nagaland Medical Council (NMC)",
    },
    {
      key: "Odisha State Medical Council (OSMC)",
      name: "Odisha State Medical Council (OSMC)",
    },
    {
      key: "Punjab State Medical Council (PMC)",
      name: "Punjab State Medical Council (PMC)",
    },
    {
      key: "Rajasthan Medical Council (RMC)",
      name: "Rajasthan Medical Council (RMC)",
    },
    {
      key: "Sikkim Medical Council (SMC)",
      name: "Sikkim Medical Council (SMC)",
    },
    {
      key: "Tamil Nadu Medical Council (TNMC)",
      name: "Tamil Nadu Medical Council (TNMC)",
    },
    {
      key: "Telangana State Medical Council (TSMC)",
      name: "Telangana State Medical Council (TSMC)",
    },
    {
      key: "Tripura State Medical Council (TSMC)",
      name: "Tripura State Medical Council (TSMC)",
    },
    {
      key: "Uttar Pradesh State Medical Council (UPMC)",
      name: "Uttar Pradesh State Medical Council (UPMC)",
    },
    {
      key: "West Bengal Medical Council (WBMC)",
      name: "West Bengal Medical Council (WBMC)",
    },
    {
      key: "Uttarakhand Medical Council (UKMC)",
      name: "Uttarakhand Medical Council (UKMC)",
    },
    {
      key: "Nagaland Medical Council (NMC)",
      name: "Nagaland Medical Council (NMC)",
    },
  ],
  BHMS: [
    {
      key: "Andhra Pradesh State Board of Homeopathy (APSBH)",
      name: "Andhra Pradesh State Board of Homeopathy (APSBH)",
    },
    {
      key: "Arunachal Pradesh Board of Homeopathy (APBH)",
      name: "Arunachal Pradesh Board of Homeopathy (APBH)",
    },
    {
      key: "Assam State Board of Homeopathy (ASBH)",
      name: "Assam State Board of Homeopathy (ASBH)",
    },
    {
      key: "Bihar State Homeopathic Medical Council (BSHMC)",
      name: "Bihar State Homeopathic Medical Council (BSHMC)",
    },
    {
      key: "Chhattisgarh Board of Homeopathy (CGBH)",
      name: "Chhattisgarh Board of Homeopathy (CGBH)",
    },
    {
      key: "Delhi Board of Homeopathic System of Medicine (DBHSM)",
      name: "Delhi Board of Homeopathic System of Medicine (DBHSM)",
    },
    {
      key: "Goa Board of Homeopathy (GBH)",
      name: "Goa Board of Homeopathy (GBH)",
    },
    {
      key: "Gujarat Council of Homeopathy (GCH)",
      name: "Gujarat Council of Homeopathy (GCH)",
    },
    {
      key: "Haryana State Board of Homeopathic System of Medicine (HSBHSM)",
      name: "Haryana State Board of Homeopathic System of Medicine (HSBHSM)",
    },
    {
      key: "Himachal Pradesh Board of Homeopathy (HPBH)",
      name: "Himachal Pradesh Board of Homeopathy (HPBH)",
    },
    {
      key: "Jammu & Kashmir Board of Homeopathy (JKBH)",
      name: "Jammu & Kashmir Board of Homeopathy (JKBH)",
    },
    {
      key: "Jharkhand State Homeopathic Medical Council (JSHMC)",
      name: "Jharkhand State Homeopathic Medical Council (JSHMC)",
    },
    {
      key: "Karnataka Board of Homeopathy (KBH)",
      name: "Karnataka Board of Homeopathy (KBH)",
    },
    {
      key: "Kerala State Homeopathic Medical Council (KSHMC)",
      name: "Kerala State Homeopathic Medical Council (KSHMC)",
    },
    {
      key: "Madhya Pradesh State Homeopathic Council (MPSHC)",
      name: "Madhya Pradesh State Homeopathic Council (MPSHC)",
    },
    {
      key: "Maharashtra Council of Homeopathy (MCH)",
      name: "Maharashtra Council of Homeopathy (MCH)",
    },
    {
      key: "Manipur State Board of Homeopathy (MSBH)",
      name: "Manipur State Board of Homeopathy (MSBH)",
    },
    {
      key: "Meghalaya State Homeopathic Council (MGSHC)",
      name: "Meghalaya State Homeopathic Council (MGSHC)",
    },
    {
      key: "Mizoram Board of Homeopathy (MZBH)",
      name: "Mizoram Board of Homeopathy (MZBH)",
    },
    {
      key: "Nagaland Board of Homeopathy (NGBH)",
      name: "Nagaland Board of Homeopathy (NGBH)",
    },
    {
      key: "Odisha State Homeopathic Medical Council (OSHMC)",
      name: "Odisha State Homeopathic Medical Council (OSHMC)",
    },
    {
      key: "Punjab State Homeopathic Medical Council (PSHMC)",
      name: "Punjab State Homeopathic Medical Council (PSHMC)",
    },
    {
      key: "Rajasthan Board of Homeopathic Medicine (RBHM)",
      name: "Rajasthan Board of Homeopathic Medicine (RBHM)",
    },
    {
      key: "Sikkim State Homeopathic Council (SKSHC)",
      name: "Sikkim State Homeopathic Council (SKSHC)",
    },
    {
      key: "Tamil Nadu Homeopathic Medical Council (TNHMC)",
      name: "Tamil Nadu Homeopathic Medical Council (TNHMC)",
    },
    {
      key: "Telangana State Homeopathic Council (TSHC)",
      name: "Telangana State Homeopathic Council (TSHC)",
    },
    {
      key: "Tripura Homeopathic Medical Council (TPHMC)",
      name: "Tripura Homeopathic Medical Council (TPHMC)",
    },
    {
      key: "Uttar Pradesh Homeopathic Medical Council (UPHMC)",
      name: "Uttar Pradesh Homeopathic Medical Council (UPHMC)",
    },
    {
      key: "Uttarakhand Homeopathic Medical Council (UKHMC)",
      name: "Uttarakhand Homeopathic Medical Council (UKHMC)",
    },
    {
      key: "West Bengal Council of Homeopathy (WBCH)",
      name: "West Bengal Council of Homeopathy (WBCH)",
    },
    {
      key: "Chandigarh Homeopathic Council (CHC)",
      name: "Chandigarh Homeopathic Council (CHC)",
    },
    {
      key: "Puducherry Homeopathic Medical Council (PHMC)",
      name: "Puducherry Homeopathic Medical Council (PHMC)",
    },
    {
      key: "Andaman & Nicobar Homeopathic Council (ANHC)",
      name: "Andaman & Nicobar Homeopathic Council (ANHC)",
    },
    {
      key: "Dadra & Nagar Haveli Homeopathic Council (DNHHC)",
      name: "Dadra & Nagar Haveli Homeopathic Council (DNHHC)",
    },
    {
      key: "Lakshadweep Homeopathic Council (LHC)",
      name: "Lakshadweep Homeopathic Council (LHC)",
    },
    {
      key: "Daman and Diu Homeopathic Council (DDHC)",
      name: "Daman and Diu Homeopathic Council (DDHC)",
    },
  ],
  BAMS: [
    {
      key: "Andhra Pradesh Board of Indian Medicine (APBIM)",
      name: "Andhra Pradesh Board of Indian Medicine (APBIM)",
    },
    {
      key: "Arunachal Pradesh State Ayurvedic and Unani Council (APSAUC)",
      name: "Arunachal Pradesh State Ayurvedic and Unani Council (APSAUC)",
    },
    {
      key: "Assam Ayurvedic Council (AAC)",
      name: "Assam Ayurvedic Council (AAC)",
    },
    {
      key: "Bihar State Ayurvedic and Unani Medical Council (BSAUMC)",
      name: "Bihar State Ayurvedic and Unani Medical Council (BSAUMC)",
    },
    {
      key: "Chhattisgarh Ayurvedic, Unani & Naturopathy Medical Board (CGANMB)",
      name: "Chhattisgarh Ayurvedic, Unani & Naturopathy Medical Board (CGANMB)",
    },
    {
      key: "Delhi Bharatiya Chikitsa Parishad (DBCP)",
      name: "Delhi Bharatiya Chikitsa Parishad (DBCP)",
    },
    {
      key: "Goa Board of Indian Medicine (GBIM)",
      name: "Goa Board of Indian Medicine (GBIM)",
    },
    {
      key: "Gujarat Board of Ayurvedic & Unani Systems of Medicine (GBAUSM)",
      name: "Gujarat Board of Ayurvedic & Unani Systems of Medicine (GBAUSM)",
    },
    {
      key: "Haryana Board of Ayurvedic and Unani Systems of Medicine (HBAUSM)",
      name: "Haryana Board of Ayurvedic and Unani Systems of Medicine (HBAUSM)",
    },
    {
      key: "Himachal Pradesh Ayurvedic and Unani Practitioners Board (HPAUPB)",
      name: "Himachal Pradesh Ayurvedic and Unani Practitioners Board (HPAUPB)",
    },
    {
      key: "Jammu & Kashmir Ayurvedic, Unani, and Homoeopathy Council (JKAUHC)",
      name: "Jammu & Kashmir Ayurvedic, Unani, and Homoeopathy Council (JKAUHC)",
    },
    {
      key: "Jharkhand State Ayurvedic Medical Board (JSAMB)",
      name: "Jharkhand State Ayurvedic Medical Board (JSAMB)",
    },
    {
      key: "Karnataka Ayurvedic and Unani Practitioners Board (KAUPB)",
      name: "Karnataka Ayurvedic and Unani Practitioners Board (KAUPB)",
    },
    {
      key: "Kerala State Ayurveda Medical Council (KSAMC)",
      name: "Kerala State Ayurveda Medical Council (KSAMC)",
    },
    {
      key: "Madhya Pradesh Ayurvedic and Unani Practitioners Board (MPAUPB)",
      name: "Madhya Pradesh Ayurvedic and Unani Practitioners Board (MPAUPB)",
    },
    {
      key: "Maharashtra Council of Indian Medicine (MCIM)",
      name: "Maharashtra Council of Indian Medicine (MCIM)",
    },
    {
      key: "Manipur State Ayurvedic and Unani Council (MSAUC)",
      name: "Manipur State Ayurvedic and Unani Council (MSAUC)",
    },
    {
      key: "Meghalaya State Board of Ayurveda (MSBA)",
      name: "Meghalaya State Board of Ayurveda (MSBA)",
    },
    {
      key: "Mizoram State Council of Ayurveda and Unani Medicine (MSC)",
      name: "Mizoram State Council of Ayurveda and Unani Medicine (MSC)",
    },
    {
      key: "Nagaland Board of Indian Medicine (NBIM)",
      name: "Nagaland Board of Indian Medicine (NBIM)",
    },
    {
      key: "Odisha State Council of Ayurvedic and Unani Medicine (OSCAUM)",
      name: "Odisha State Council of Ayurvedic and Unani Medicine (OSCAUM)",
    },
    {
      key: "Punjab Ayurvedic and Unani Practitioners Board (PAUPB)",
      name: "Punjab Ayurvedic and Unani Practitioners Board (PAUPB)",
    },
    {
      key: "Rajasthan Ayurvedic, Unani, Homoeopathy, and Naturopathy Medicine Board (RAUHNM)",
      name: "Rajasthan Ayurvedic, Unani, Homoeopathy, and Naturopathy Medicine Board (RAUHNM)",
    },
    {
      key: "Sikkim Ayurvedic Council (SAC)",
      name: "Sikkim Ayurvedic Council (SAC)",
    },
    {
      key: "Tamil Nadu Board of Indian Medicine (TNBIM)",
      name: "Tamil Nadu Board of Indian Medicine (TNBIM)",
    },
    {
      key: "Telangana State Ayurvedic and Unani Medical Board (TSAUMB)",
      name: "Telangana State Ayurvedic and Unani Medical Board (TSAUMB)",
    },
    {
      key: "Tripura State Ayurvedic Council (TSAC)",
      name: "Tripura State Ayurvedic Council (TSAC)",
    },
    {
      key: "Uttar Pradesh State Ayurvedic and Unani Medical Board (UPSAUMB)",
      name: "Uttar Pradesh State Ayurvedic and Unani Medical Board (UPSAUMB)",
    },
    {
      key: "West Bengal Ayurvedic Council (WBAC)",
      name: "West Bengal Ayurvedic Council (WBAC)",
    },
  ],
  BDS: [
    {
      key: "Andhra Pradesh State Dental Council (APSDC)",
      name: "Andhra Pradesh State Dental Council (APSDC)",
    },
    {
      key: "Arunachal Pradesh Dental Council (APDC)",
      name: "Arunachal Pradesh Dental Council (APDC)",
    },
    {
      key: "Assam State Dental Council (ASDC)",
      name: "Assam State Dental Council (ASDC)",
    },
    {
      key: "Bihar State Dental Council (BSDC)",
      name: "Bihar State Dental Council (BSDC)",
    },
    {
      key: "Chhattisgarh State Dental Council (CGSDC)",
      name: "Chhattisgarh State Dental Council (CGSDC)",
    },
    {
      key: "Delhi State Dental Council (DSDC)",
      name: "Delhi State Dental Council (DSDC)",
    },
    {
      key: "Goa State Dental Council (GSDC)",
      name: "Goa State Dental Council (GSDC)",
    },
    {
      key: "Gujarat State Dental Council (GJSDC)",
      name: "Gujarat State Dental Council (GJSDC)",
    },
    {
      key: "Haryana State Dental Council (HSDC)",
      name: "Haryana State Dental Council (HSDC)",
    },
    {
      key: "Himachal Pradesh State Dental Council (HPSDC)",
      name: "Himachal Pradesh State Dental Council (HPSDC)",
    },
    {
      key: "Jammu & Kashmir State Dental Council (JKSDC)",
      name: "Jammu & Kashmir State Dental Council (JKSDC)",
    },
    {
      key: "Jharkhand State Dental Council (JSDC)",
      name: "Jharkhand State Dental Council (JSDC)",
    },
    {
      key: "Karnataka State Dental Council (KSDC)",
      name: "Karnataka State Dental Council (KSDC)",
    },
    {
      key: "Kerala State Dental Council (KLSDC)",
      name: "Kerala State Dental Council (KLSDC)",
    },
    {
      key: "Madhya Pradesh State Dental Council (MPSDC)",
      name: "Madhya Pradesh State Dental Council (MPSDC)",
    },
    {
      key: "Maharashtra State Dental Council (MHSDC)",
      name: "Maharashtra State Dental Council (MHSDC)",
    },
    {
      key: "Manipur State Dental Council (MNSDC)",
      name: "Manipur State Dental Council (MNSDC)",
    },
    {
      key: "Meghalaya State Dental Council (MGSDC)",
      name: "Meghalaya State Dental Council (MGSDC)",
    },
    {
      key: "Mizoram State Dental Council (MZSDC)",
      name: "Mizoram State Dental Council (MZSDC)",
    },
    {
      key: "Nagaland State Dental Council (NLSDC)",
      name: "Nagaland State Dental Council (NLSDC)",
    },
    {
      key: "Odisha State Dental Council (OSDC)",
      name: "Odisha State Dental Council (OSDC)",
    },
    {
      key: "Punjab State Dental Council (PSDC)",
      name: "Punjab State Dental Council (PSDC)",
    },
    {
      key: "Rajasthan State Dental Council (RJSDC)",
      name: "Rajasthan State Dental Council (RJSDC)",
    },
    {
      key: "Sikkim State Dental Council (SKSDC)",
      name: "Sikkim State Dental Council (SKSDC)",
    },
    {
      key: "Tamil Nadu State Dental Council (TNSDC)",
      name: "Tamil Nadu State Dental Council (TNSDC)",
    },
    {
      key: "Telangana State Dental Council (TSDSC)",
      name: "Telangana State Dental Council (TSDSC)",
    },
    {
      key: "Tripura State Dental Council (TPSDC)",
      name: "Tripura State Dental Council (TPSDC)",
    },
    {
      key: "Uttar Pradesh State Dental Council (UPSDC)",
      name: "Uttar Pradesh State Dental Council (UPSDC)",
    },
    {
      key: "West Bengal State Dental Council (WBSDC)",
      name: "West Bengal State Dental Council (WBSDC)",
    },
  ],
};

export default function EditProfileComponent(props: any) {
  const dispatch = useDispatch<AppDispatch>();
  const id = useAppSelector((state) => state.profileReducer.value.id);

  const [authdata, setAuthData] = useState<any>("");
  const [name, setName] = useState<any>(null);
  const [dob, setDob] = useState<any>(null);
  const [mobile, setMobile] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [registrationNumber, setRegistrationNumber] = useState<any>(null);
  const [selectedCouncil, setSelectedCouncil] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [regCert, setRegCert] = useState<File | null>(null);
  const [degreeCert, setDegreeCert] = useState<File | null>(null);
  const [experience, setExperience] = useState<any>(null);
  const [bio, setBio] = useState<any>(null); // New state for bio
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [isRegCertUploaded, setIsRegCertUploaded] = useState(false);
  const [isDegreeCertUploaded, setIsDegreeCertUploaded] = useState(false);
  const [experienceYears, setExperienceYears] = useState<any>(null);
  const [selectedDegree, setSelectedDegree] = useState<Degree | "">("");
  const [selectedPGCourse, setSelectedPGCourse] = useState<PGCourses | "">("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState("Not Applicable");
  const [pgCourses, setPGCourses] = useState<PGCourses[]>([]);
  const [specializationCourses, setSpecializationCourses] =
    useState<SpecializationCourses>([]);
  const [qualificationsRefetchTrigger, setQualificationsRefetchTrigger] =
    useState<number>(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otp, setOtp] = useState<any>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isContactVerified, setIsContactVerified] = useState(false);
  const [isEducationUploaded, setIsEducationUploaded] = useState(false);
  const [secondTimeAccUpdate, setSecondTimeAccUpdate] = useState(false);
  const [selectedDegforCouncil, setSelectedDegforCouncil] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    dob: false,
    mobile: false,
    selectedState: false,
    selectedCity: false,
    address: false,
    profilePhoto: false,
    degreeCert: false,
    regCert: false,
    registrationNumber: false,
    experience: false,
    experienceYears: false,
    selectedCouncil: false,
  });

  const handleDelete = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const data = getCookie("authData");
    if (data) {
      const authData = JSON.parse(data as string);
      authData && setAuthData(authData);
    }
  }, []);
  useEffect(() => {
    const fetchProfileData = async () => {
      const record = await pb.collection("view_users").getOne(id);
      console.log(record);
      setSecondTimeAccUpdate(record?.isFirstTimeCompleted);
    };
    fetchProfileData();
  }, []);

  const handleDegreeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const degree = e.target.value as Degree;
    setSelectedDegree(degree);

    // Fetch Postgraduate Courses based on selected Degree
    if (degree) {
      const pgOptions = Object.keys(
        educationalQualifications.degrees[degree]?.postgraduateCourses || {}
      ) as PGCourses[];

      setPGCourses(pgOptions);
    } else {
      setPGCourses([]);
    }

    // Always set PG Course and Specialization to "Not Applicable" by default
    setSelectedPGCourse("Not Applicable");
    setSpecializationCourses([]);
    setSelectedSpecialization("Not Applicable");

    setSelectedDegforCouncil(degree);
    setSelectedCouncil("");
  };

  const handlePGCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pgCourse = e.target.value as PGCourses;
    setSelectedPGCourse(pgCourse);

    // Fetch specialization options if PG course is selected
    if (pgCourse && selectedDegree) {
      const specializationOptions =
        educationalQualifications.degrees[selectedDegree].postgraduateCourses[
          pgCourse
        ];
      setSpecializationCourses(specializationOptions);
    } else {
      setSpecializationCourses([]);
    }

    // Default specialization to "Not Applicable"
    setSelectedSpecialization("Not Applicable");
  };

  const handleSpecializationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSpecialization(e.target.value);
  };

  const handleCouncilChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCouncil(event.target.value);
  };
  const relevantCouncilOptions =
    councilOptions[selectedDegforCouncil as DegreeOptions] || [];

  const validateContactNumber = () => {
    if (mobile.length !== 10) {
      toast.error("Contact number must be 10 digits long.");
      return false;
    }
    return true;
  };
  const setIsDocumentUploaded = async (): Promise<void> => {
    let headersList = {
      Accept: "/",
      Authorization: `Bearer ${authdata?.token}`,
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      is_document_uploaded: true,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/is-document-uploaded`,
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    );

    const data = await response.text();
    console.log(data);
    return new Promise((resolve) => {
      console.log("Document marked as uploaded.");
      resolve();
    });
  };
  const handleEducationalDetails = async () => {
    if (!selectedDegree || !selectedPGCourse || !selectedSpecialization) {
      toast.error("Please select all educational details.");
      return;
    }

    const data = {
      degree: selectedDegree,
      pg: selectedPGCourse,
      specialization: selectedSpecialization,
      user: id,
    };

    try {
      const record = await pb.collection("user_credentials").create(data);
      console.log("Educational details posted successfully:", record);
      toast.success("Educational details added successfully!");

      setSelectedDegree("");
      setSelectedPGCourse("");
      setSelectedSpecialization("");
      setPGCourses([]);
      setSpecializationCourses([]);

      // Trigger a refetch of the qualifications
      setQualificationsRefetchTrigger((prev) => prev + 1);
      setIsEducationUploaded(true);
    } catch (error: any) {
      console.error("Error posting educational details:", error);
      toast.error(error.message || "An error occurred while adding details.");
    }
  };

  const validateProfilePhoto = () => {
    if (profilePhoto) {
      const allowedTypes = ["image/png", "image/jpeg"];
      if (!allowedTypes.includes(profilePhoto.type)) {
        toast.error(
          "Only PNG and JPG formats are allowed for the profile photo."
        );
        return false;
      }
    }
    return true;
  };

  const uploadProfilePhoto = async () => {
    if (!profilePhoto) {
      console.error("No profile photo selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profile", profilePhoto);

    return toast
      .promise(pb.collection("users").update(id, formData), {
        loading: "Uploading profile photo...",
        success: "Profile photo uploaded successfully 😎",
        error: "Profile photo upload failed 😞",
      })
      .then(() => setIsPhotoUploaded(true));
  };

  const uploadRegistrationCertificate = async () => {
    if (!regCert) {
      console.error("No registration certificate selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("registration_certificate", regCert);

    return toast
      .promise(pb.collection("users").update(id, formData), {
        loading: "Uploading registration certificate...",
        success: "Registration certificate uploaded successfully 😎",
        error: "Registration certificate upload failed 😞",
      })
      .then(() => setIsRegCertUploaded(true));
  };

  const uploadDegreeCertificate = async () => {
    if (!degreeCert) {
      console.error("No degree certificate selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("degree_certificate", degreeCert);

    return toast
      .promise(pb.collection("users").update(id, formData), {
        loading: "Uploading degree certificate...",
        success: "Degree certificate uploaded successfully 😎",
        error: "Degree certificate upload failed 😞",
      })
      .then(() => setIsDegreeCertUploaded(true));
  };
  const validateFields = () => {
    const errors = {
      dob: !dob,
      mobile: !mobile || !isContactVerified,
      selectedState: !selectedState,
      selectedCity: !selectedCity,
      address: !address,
      // bio: !bio,
      profilePhoto: !isPhotoUploaded,
      degreeCert: !isDegreeCertUploaded,
      regCert: !isRegCertUploaded,
      registrationNumber: !registrationNumber,
      experience: !experience,
      experienceYears: !experienceYears,
      selectedCouncil: !selectedCouncil,
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const updateProfile = async () => {
    // Validate contact number and profile photo
    if (!validateFields()) {
      toast.error(
        "Please fill all required fields and verify your contact number."
      );
      return;
    }
    if (!validateProfilePhoto()) {
      return;
    }

    // Prepare the profile data
    const profileData = {
      dob,
      mobile,
      state: selectedState,
      city: selectedCity,
      address,
      registrationNumber,
      selectedCouncil,
      experience,
      selectedDegrees: selectedDegree,
      selectedSpecializations: selectedPGCourse,
      // bio,
      experienceYears,
      isFirstTimeCompleted: true,
    };

    // Show loading toast while the profile is being updated
    try {
      await toast.promise(pb.collection("users").update(id, profileData), {
        loading: "Updating profile...",
        success: () => {
          // Call the function to mark the document as uploaded on success
          setIsDocumentUploaded();
          props.handleShowEditProfile(true);
          props.handleTabClick("profile");

          // Reset all fields upon successful profile update
          resetFields();

          return "Profile updated and sent for verification. Once verified, you can post jobs. ✨";
        },
        error: "Profile update failed 😞",
      });

      // Show final success toast message

      // router.refresh();
      // window.location.href = "/doctor-dashboard";
    } catch (error) {
      console.error(
        "Error while updating profile or marking document as uploaded:",
        error
      );
      toast.error("An error occurred during the update process.");
    }
  };
  const sendForVerification = async () => {
    try {
      let headersList = {
        Authorization: `Bearer ${authdata?.token}`,
      };

      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/collections/users/re-verify-documents`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.text();
      if (response.status === 200) {
        toast.success("Profile has been sent for verification");
        props.handleTabClick("profile");
      }
      console.log(data);
    } catch (error) {}
  };
  const updateProfileNew = async () => {
    const criticalFieldsPresent =
      name ||
      isEducationUploaded ||
      isRegCertUploaded ||
      isDegreeCertUploaded ||
      registrationNumber ||
      selectedCouncil;

    console.log("Critical Fields Present:", criticalFieldsPresent);

    const profileData = {
      name,
      dob,
      mobile,
      state: selectedState,
      city: selectedCity,
      selectedCouncil,
      registrationNumber,
      address,
      experience,
      // bio,
      experienceYears,
    };

    console.log("Profile Data:", profileData);

    // Filter out null or undefined fields
    const availableFields = Object.entries(profileData).filter(
      ([key, value]) => value !== null && value !== undefined
    );

    // Convert the filtered fields back to an object
    const filteredProfileData = Object.fromEntries(availableFields);

    if (Object.keys(filteredProfileData).length === 0) {
      if (!criticalFieldsPresent)
        toast.error("Please fill in at least one field to update.");
    } else {
      try {
        await toast.promise(
          pb.collection("users").update(id, filteredProfileData),
          {
            loading: "Updating profile...",
            success: () => {
              setIsDocumentUploaded();

              if (!criticalFieldsPresent) {
                props.handleShowEditProfile(true);
                props.handleTabClick("profile");

                resetFields();
              }

              return "Profile updated successfully";
            },
            error: "Profile update failed",
          }
        );
      } catch (error) {
        console.error(
          "Error while updating profile or marking document as uploaded:",
          error
        );
        toast.error("An error occurred during the update process.");
      }
    }

    if (criticalFieldsPresent) {
      await sendForVerification();
    }
  };

  useEffect(() => {
    try {
      uploadProfilePhoto();
    } catch (error) {
      console.log("Photo uploading failed");
    }
  }, [profilePhoto]);

  // Function to reset all fields
  const resetFields = () => {
    setDob(null);
    setMobile(null);
    setSelectedState(null);
    setSelectedCity(null);
    setAddress(null);
    setRegistrationNumber(null);
    setSelectedCouncil(null);
    setExperience(null);
    setSelectedDegree("");
    setSelectedPGCourse("");
    setBio(null);
    setExperienceYears(null);
    setProfilePhoto(null);
    setRegCert(null);
    setDegreeCert(null);
    setIsPhotoUploaded(false);
    setIsRegCertUploaded(false);
    setIsDegreeCertUploaded(false);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = event.target.value;
    setSelectedState(newState);
    setSelectedCity("");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };
  const handleEmailChange = async () => {
    if (!email || email.length === 0) {
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to update your email address? You will be logged out and will need to log in again after verifying your new email. Please check your inbox to complete the verification process."
    );
    if (!confirmed) return;
    try {
      const response = await pb.collection("users").requestEmailChange(email);
      console.log("Email change response ", response);
      toast.success("Email change request sent successfully!");
      pb.authStore.clear();
      deleteCookie("authToken");
      deleteCookie("authData");
      dispatch(resetProfile());
      toast.success("You have been logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      console.log("Email change error", error);
      toast.error("Changing Email failed. Try again");
    }
  };
  const handleSendOtp = async () => {
    let headersList = {
      Accept: "/",
      Authorization: `Bearer ${authdata?.token}`,
      "Content-Type": "application/json",
    };
    let bodyContent = JSON.stringify({
      mobile: mobile,
    });

    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/collections/users/send-otp`,
        {
          method: "POST",
          headers: headersList,
          body: bodyContent,
        }
      );

      const data = await response.json(); // Extract JSON from the response

      if (response.ok) {
        setOtpSent(true);
        setIsOtpVisible(true);
        toast.success(data.message || "OTP sent successfully!"); // Show message from the response
      } else {
        toast.error(data.message || "Failed to send OTP. Please try again.");
        setMobile(null);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    let headersList = {
      Accept: "/",
      Authorization: `Bearer ${authdata?.token}`,
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      otp: otp,
    });

    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/collections/users/verify-otp`,
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      const data = await response.json(); // Extract JSON from the response

      if (response.ok) {
        toast.success(data.message || "OTP verified successfully!"); // Show message from the response
        setIsOtpVisible(false);
        setIsContactVerified(true);
      } else {
        toast.error(
          data.message || "OTP verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred while verifying OTP.");
    }
  };

  const isFormValid = () => {
    const allFieldsFilled =
      dob &&
      selectedState &&
      selectedCity &&
      address &&
      registrationNumber &&
      selectedCouncil &&
      experience &&
      bio &&
      experienceYears;

    // Check if profile photo and documents are uploaded
    const allDocumentsUploaded =
      isPhotoUploaded && isRegCertUploaded && isDegreeCertUploaded;

    return allFieldsFilled && allDocumentsUploaded;
  };
  const allFieldsSelected = selectedDegree && selectedPGCourse;
  const renderInput = (
    name: keyof typeof fieldErrors,
    value: string,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void,
    placeholder: string,
    type: string = "text"
  ) => (
    <div>
      <input
        required
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          fieldErrors[name] ? "border-red-500" : ""
        }`}
        placeholder={placeholder}
      />
      {fieldErrors[name] && (
        <p className="text-red-500 mt-1">This field is required</p>
      )}
    </div>
  );
  return (
    <>
      {secondTimeAccUpdate ? (
        // Second time after first time Profile Update :=>
        <>
          <div className="flex flex-col text-black dark:text-white w-full max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 dark:text-white text-blue-800 text-center">
              Edit Professional profile
            </h1>

            <div className="grid grid-cols-1  gap-4 sm:gap-6">
              {/* profile Photo */}
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-300 bg-gray-100">
                  {profilePhoto ? (
                    <img
                      src={URL.createObjectURL(profilePhoto)}
                      alt="profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs sm:text-sm dark:text-white">
                      No Photo
                    </span>
                  )}
                </div>
                <input
                  required
                  accept="image/png, image/jpeg"
                  type="file"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                  className="hidden"
                  id="profile-photo-upload"
                />
                <label
                  htmlFor="profile-photo-upload"
                  className=" cursor-pointer px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isPhotoUploaded
                    ? "Update Profile Photo"
                    : "Select Profile Photo"}
                </label>

                {/* <button
                  onClick={uploadProfilePhoto}
                  className="mt-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isPhotoUploaded}
                >
                  {isPhotoUploaded
                    ? "profile Photo Uploaded"
                    : "Upload profile Photo"}
                </button> */}
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-base sm:text-lg dark:text-white font-medium text-gray-700 mb-1 sm:mb-2">
                  Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-gray-700 p-3 dark:text-white sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter Name"
                />
              </div>

              {/* Registration Certificate */}

              <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                      Date of Birth
                    </label>
                    <input
                      required
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full dark:text-white p-3 sm:p-4 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                      Change Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full dark:text-white p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Email Address"
                    />
                    <button
                      onClick={handleEmailChange}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:text-white"
                    >
                      Change Email
                    </button>
                  </div>

                  {/* Contact Number */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <span>Mobile number must be associated with Whatsapp</span>
                    <input
                      required
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full dark:text-white p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your whatsapp number"
                    />

                    <button
                      onClick={handleSendOtp}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:text-white"
                    >
                      Change Contact Number
                    </button>
                    {otpSent && (
                      <p className="text-green-500 mt-2">
                        OTP sent to the corresponding number!
                      </p>
                    )}
                    {isOtpVisible && (
                      <div className="mt-4">
                        <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full dark:text-white p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter the OTP"
                        />
                        <button
                          onClick={handleVerifyOtp}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:text-white"
                        >
                          Verify OTP
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                      State
                    </label>
                    <select
                      required
                      value={selectedState}
                      onChange={handleStateChange}
                      className="w-full dark:text-white p-3 sm:p-4 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    >
                      <option value="">Select a state</option>
                      {Object.keys(typedStateCityData).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                      City
                    </label>
                    <select
                      required
                      value={selectedCity}
                      onChange={handleCityChange}
                      className="w-full p-3 sm:p-4 dark:text-white text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      disabled={!selectedState}
                    >
                      <option value="">Select a city</option>
                      {selectedState &&
                        typedStateCityData[selectedState].map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-base sm:text-lg dark:text-white font-medium text-gray-700 mb-1 sm:mb-2">
                      Address
                    </label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-gray-700 p-3 dark:text-white sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Enter address"
                      rows={4}
                    />
                  </div>

                  {/* Experience Years */}
                  <div>
                    <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-white mb-1 sm:mb-2">
                      Experience years
                    </label>
                    <input
                      required
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full dark:text-white text-gray-700 p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Enter experience in years"
                    />
                  </div>

                  {/* Experience */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-white mb-1 sm:mb-2">
                      Describe your experience
                    </label>
                    <textarea
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full p-3 dark:text-white text-gray-700 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Describe your experience"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Degree Dropdown */}
                <div className="flex flex-wrap gap-4">
                  <span className="text-red-500 ml-1">*</span>
                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="degree"
                      className="block text-gray-700 dark:text-white font-medium mb-2"
                    >
                      Select Degree
                    </label>
                    <select
                      id="degree"
                      value={selectedDegree}
                      onChange={handleDegreeChange}
                      className="w-full dark:text-white text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="">Select a Degree</option>
                      {Object.keys(educationalQualifications.degrees).map(
                        (degree) => (
                          <option key={degree} value={degree}>
                            {degree}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Postgraduate Course Dropdown */}
                  {pgCourses.length > 0 && (
                    <div className="flex-1 min-w-[200px]">
                      <label
                        htmlFor="pg-course"
                        className="block text-gray-700 dark:text-white font-medium mb-2"
                      >
                        Select Postgraduate Course
                      </label>
                      <select
                        id="pg-course"
                        value={selectedPGCourse}
                        onChange={handlePGCourseChange}
                        className="w-full dark:text-white text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        <option value="">Select a PG Course</option>
                        {pgCourses.map((pgCourse) => (
                          <option key={pgCourse} value={pgCourse}>
                            {pgCourse}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Specialization Course Dropdown */}
                  {specializationCourses.length > 0 && (
                    <div className="flex-1 min-w-[200px]">
                      <label
                        htmlFor="specialization-course"
                        className="block text-gray-700 dark:text-white font-medium mb-2"
                      >
                        Select Specialization
                      </label>
                      <select
                        id="specialization-course"
                        value={selectedSpecialization}
                        onChange={handleSpecializationChange}
                        className="w-full text-black p-2 border dark:text-white border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        <option value="">Select a Specialization</option>
                        {specializationCourses.map((specialization) => (
                          <option key={specialization} value={specialization}>
                            {specialization}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Add Button */}
                  {allFieldsSelected && (
                    <div className="flex-1 min-w-[200px] flex items-end">
                      <button
                        onClick={handleEducationalDetails}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Save Qualification
                      </button>
                    </div>
                  )}
                </div>
                <EducationalQualificationsTable
                  userId={id}
                  triggerRefetch={qualificationsRefetchTrigger}
                  onDelete={handleDelete}
                />
                {selectedDegforCouncil && relevantCouncilOptions.length > 0 && (
                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="council"
                      className="block text-gray-700 dark:text-white font-medium mb-2"
                    >
                      Select Council
                    </label>
                    <select
                      id="council"
                      value={selectedCouncil}
                      onChange={handleCouncilChange}
                      className="w-full dark:text-white text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 "
                    >
                      <option value="">Select a Council</option>
                      {relevantCouncilOptions.map((option: any) => (
                        <option key={option.key} value={option.key}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Registration Number
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                    placeholder="Enter Reg Number Without Council"
                    required
                  />
                </div>

                <p className="flex justify-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                  If you have multiple documents, please merge them into a
                  single PDF file before uploading.
                </p>
                <div>
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Upload Registration Certificate
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    required
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setRegCert(e.target.files?.[0] || null)}
                    className="w-full p-2 dark:text-white dark:bg-gray-800 text-black sm:p-3 border rounded-lg bg-gray-100 text-sm sm:text-base"
                  />
                  <button
                    onClick={uploadRegistrationCertificate}
                    className="mt-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isRegCertUploaded}
                  >
                    {isRegCertUploaded
                      ? "Registration Certificate Uploaded"
                      : "Upload Registration Certificate"}
                  </button>
                </div>

                {/* Degree Certificate */}
                <div>
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Upload Passing Certificate
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    required
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setDegreeCert(e.target.files?.[0] || null)}
                    className="w-full text-black dark:text-white dark:bg-gray-800 p-2 sm:p-3 border rounded-lg bg-gray-100 text-sm sm:text-base"
                  />
                  <button
                    onClick={uploadDegreeCertificate}
                    className="mt-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isDegreeCertUploaded}
                  >
                    {isDegreeCertUploaded
                      ? "Degree Certificate Uploaded"
                      : "Upload Degree Certificate"}
                  </button>
                </div>
              </div>
            </div>

            <p className="lg:flex md:flex-auto justify-center text-sm sm:text-base text-gray-600 font-bold dark:text-gray-400 mt-4">
              If you change any of the fields marked with asterisk (
              <span className="text-red-500">*</span>), Admin will need to
              verify your profile again before you can apply for new jobs.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={updateProfileNew}
                className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col text-black dark:text-white w-full max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 dark:text-white text-blue-800 text-center">
              Edit Professional profile
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
              {/* profile Photo */}
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-300 bg-gray-100">
                  {profilePhoto ? (
                    <img
                      src={URL.createObjectURL(profilePhoto)}
                      alt="profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs sm:text-sm dark:text-white">
                      No Photo
                    </span>
                  )}
                </div>
                <input
                  required
                  accept="image/png, image/jpeg"
                  type="file"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                  className="hidden"
                  id="profile-photo-upload"
                />
                <label
                  htmlFor="profile-photo-upload"
                  className=" cursor-pointer px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isPhotoUploaded
                    ? "Upload Profile Photo"
                    : "Select profile Photo"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                {/* <button
                  onClick={uploadProfilePhoto}
                  className="mt-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isPhotoUploaded}
                >
                  {isPhotoUploaded
                    ? "profile Photo Uploaded"
                    : "Upload profile Photo"}
                </button> */}
                {fieldErrors.profilePhoto && (
                  <p className="text-red-500 mt-1">Profile photo is required</p>
                )}
              </div>

              <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                      Date of Birth
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.dob ? "border-red-500" : ""
                      }`}
                    />
                    {fieldErrors.dob && (
                      <p className="text-red-500 mt-1">
                        Date of birth is required
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div className="col-span-1 sm:col-span-2">
                    {renderInput(
                      "mobile",
                      mobile,
                      (e) => setMobile(e.target.value),
                      "Enter your whatsapp number"
                    )}
                    <button
                      onClick={handleSendOtp}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:text-white"
                    >
                      Verify Contact Number
                    </button>
                    {fieldErrors.mobile && (
                      <p className="text-red-500 mt-1">
                        Contact number must be verified
                      </p>
                    )}
                    {otpSent && (
                      <p className="text-green-500 mt-2">
                        OTP sent to the corresponding number!
                      </p>
                    )}
                    {isOtpVisible && (
                      <div className="mt-4">
                        <label className="block text-lg font-medium dark:text-white text-gray-700 mb-2">
                          Enter OTP
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full dark:text-white p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter the OTP"
                        />
                        <button
                          onClick={handleVerifyOtp}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:text-white"
                        >
                          Verify OTP
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Address */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-base sm:text-lg dark:text-white font-medium text-gray-700 mb-1 sm:mb-2">
                      Address
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.address ? "border-red-500" : ""
                      }`}
                      // className="w-full text-gray-700 p-3 dark:text-white sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Enter address"
                      rows={4}
                    />
                    {fieldErrors.address && (
                      <p className="text-red-500 mt-1">Address is required</p>
                    )}
                  </div>
                  {/* State */}
                  <div>
                    <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                      State
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      required
                      value={selectedState}
                      onChange={handleStateChange}
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.selectedState ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select a state</option>
                      {Object.keys(typedStateCityData).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.selectedState && (
                      <p className="text-red-500 mt-1">State is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                      City
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      required
                      value={selectedCity}
                      onChange={handleCityChange}
                      className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.selectedCity ? "border-red-500" : ""
                      }`}
                      disabled={!selectedState}
                    >
                      <option value="">Select a city</option>
                      {selectedState &&
                        typedStateCityData[selectedState].map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                    {fieldErrors.selectedCity && (
                      <p className="text-red-500 mt-1">City is required</p>
                    )}
                  </div>

                  {/* Experience Years */}
                  <div>
                    <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-white mb-1 sm:mb-2">
                      Experience years
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className={`w-full dark:text-white text-gray-700 p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        fieldErrors.experienceYears ? "border-red-500" : ""
                      }`}
                      // className="w-full dark:text-white text-gray-700 p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Enter experience in years"
                    />
                  </div>

                  {/* Experience */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-white mb-1 sm:mb-2">
                      Describe your experience
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className={`w-full p-3 dark:text-white text-gray-700 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        fieldErrors.experience ? "border-red-500" : ""
                      }`}
                      // className="w-full p-3 dark:text-white text-gray-700 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Describe your experience"
                      rows={4}
                    />
                    {fieldErrors.experience && (
                      <p className="text-red-500 mt-1">
                        Experience is required
                      </p>
                    )}
                  </div>
                </div>

                {/* Degree Dropdown */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="degree"
                      className="block text-gray-700 dark:text-white font-medium mb-2"
                    >
                      Select Degree
                    </label>
                    <select
                      id="degree"
                      value={selectedDegree}
                      onChange={handleDegreeChange}
                      className="w-full dark:text-white text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="">Select a Degree</option>
                      {Object.keys(educationalQualifications.degrees).map(
                        (degree) => (
                          <option key={degree} value={degree}>
                            {degree}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Postgraduate Course Dropdown */}
                  {pgCourses.length > 0 && (
                    <div className="flex-1 min-w-[200px]">
                      <label
                        htmlFor="pg-course"
                        className="block text-gray-700 dark:text-white font-medium mb-2"
                      >
                        Select Postgraduate Course
                      </label>
                      <select
                        id="pg-course"
                        value={selectedPGCourse}
                        onChange={handlePGCourseChange}
                        className="w-full dark:text-white text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        <option value="">Select a PG Course</option>
                        {pgCourses.map((pgCourse) => (
                          <option key={pgCourse} value={pgCourse}>
                            {pgCourse}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Specialization Course Dropdown */}
                  {specializationCourses.length > 0 && (
                    <div className="flex-1 min-w-[200px]">
                      <label
                        htmlFor="specialization-course"
                        className="block text-gray-700 dark:text-white font-medium mb-2"
                      >
                        Select Specialization
                      </label>
                      <select
                        id="specialization-course"
                        value={selectedSpecialization}
                        onChange={handleSpecializationChange}
                        className="w-full text-black p-2 border dark:text-white border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        <option value="">Select a Specialization</option>
                        {specializationCourses.map((specialization) => (
                          <option key={specialization} value={specialization}>
                            {specialization}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Add Button */}
                  {allFieldsSelected && (
                    <div className="flex-1 min-w-[200px] flex items-end">
                      <button
                        onClick={handleEducationalDetails}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Save Qualification
                      </button>
                    </div>
                  )}
                </div>
                <EducationalQualificationsTable
                  userId={id}
                  triggerRefetch={qualificationsRefetchTrigger}
                  onDelete={handleDelete}
                />
                {/* Council Dropdown */}
                {selectedDegforCouncil && relevantCouncilOptions.length > 0 && (
                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="council"
                      className="block text-gray-700 dark:text-white font-medium mb-2"
                    >
                      Select Council
                    </label>
                    <select
                      id="council"
                      value={selectedCouncil}
                      onChange={handleCouncilChange}
                      className={`w-full dark:text-white text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${
                        fieldErrors.selectedCouncil ? "border-red-500" : ""
                      }`}

                      // className="w-full dark:text-white text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="">Select a Council</option>
                      {relevantCouncilOptions.map((option: any) => (
                        <option key={option.key} value={option.key}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.selectedCouncil && (
                      <p className="text-red-500 mt-1">Council is required</p>
                    )}
                  </div>
                )}
                {/* Registration Number */}
                <div>
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Registration Number
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.registrationNumber ? "border-red-500" : ""
                    }`}
                    // className="w-full text-gray-700 dark:text-white p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="Enter Reg Number Without Council"
                    required
                  />
                  {fieldErrors.registrationNumber && (
                    <p className="text-red-500 mt-1">
                      Registration number is required
                    </p>
                  )}
                </div>
                <p className="flex justify-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                  If you have multiple documents, please merge them into a
                  single PDF file before uploading.
                </p>
                <div>
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Upload Registration Certificate
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    required
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setRegCert(e.target.files?.[0] || null)}
                    className="w-full p-2 dark:text-white dark:bg-gray-800 text-black sm:p-3 border rounded-lg bg-gray-100 text-sm sm:text-base"
                  />
                  <button
                    onClick={uploadRegistrationCertificate}
                    className="mt-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isRegCertUploaded}
                  >
                    {isRegCertUploaded
                      ? "Registration Certificate Uploaded"
                      : "Upload Registration Certificate"}
                  </button>
                  {fieldErrors.regCert && (
                    <p className="text-red-500 mt-1">
                      Registration Certificate is required
                    </p>
                  )}
                </div>

                {/* Degree Certificate */}
                <div>
                  <label className="block text-base sm:text-lg font-medium dark:text-white text-gray-700 mb-1 sm:mb-2">
                    Upload Passing Certificate
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    required
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setDegreeCert(e.target.files?.[0] || null)}
                    className="w-full text-black dark:text-white dark:bg-gray-800 p-2 sm:p-3 border rounded-lg bg-gray-100 text-sm sm:text-base"
                  />
                  <button
                    onClick={uploadDegreeCertificate}
                    className="mt-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isDegreeCertUploaded}
                  >
                    {isDegreeCertUploaded
                      ? "Degree Certificate Uploaded"
                      : "Upload Degree Certificate"}
                  </button>
                  {fieldErrors.degreeCert && (
                    <p className="text-red-500 mt-1">
                      Degree Certificate is required
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={updateProfile}
                className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Update Profile and Send for Verification
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
