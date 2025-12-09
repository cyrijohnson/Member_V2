import { FormEvent, useEffect, useMemo, useState } from 'react';
import { MemberDetail, DisabilityTypeOption } from '../types/member';
import { updateMyDetails } from '../api/member';
import { apiClient } from '../api/client';

interface ProfileProps {
  member: MemberDetail | null;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => Promise<void> | void;
}

const formatValue = (value: string | number | boolean | null | undefined) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const toDateInputValue = (value: unknown) => {
  if (!value) return '';

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return '';

  return parsed.toISOString().slice(0, 10);
};

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Congo-Brazzaville)',
  'Costa Rica',
  "Côte d'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czechia',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States of America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe'
];

const NATIONALITIES = [
  'Afghan',
  'Albanian',
  'Algerian',
  'American',
  'Andorran',
  'Angolan',
  'Argentine',
  'Armenian',
  'Australian',
  'Austrian',
  'Azerbaijani',
  'Bahamian',
  'Bahraini',
  'Bangladeshi',
  'Barbadian',
  'Belarusian',
  'Belgian',
  'Belizean',
  'Beninese',
  'Bhutanese',
  'Bolivian',
  'Bosnian',
  'Botswanan',
  'Brazilian',
  'British',
  'Bruneian',
  'Bulgarian',
  'Burkinabe',
  'Burmese',
  'Burundian',
  'Cambodian',
  'Cameroonian',
  'Canadian',
  'Cape Verdean',
  'Central African',
  'Chadian',
  'Chilean',
  'Chinese',
  'Colombian',
  'Comoran',
  'Congolese',
  'Costa Rican',
  'Croatian',
  'Cuban',
  'Cypriot',
  'Czech',
  'Danish',
  'Djiboutian',
  'Dominican',
  'Dutch',
  'Ecuadorian',
  'Egyptian',
  'Emirati',
  'English',
  'Equatorial Guinean',
  'Eritrean',
  'Estonian',
  'Ethiopian',
  'Fijian',
  'Finnish',
  'French',
  'Gabonese',
  'Gambian',
  'Georgian',
  'German',
  'Ghanaian',
  'Greek',
  'Grenadian',
  'Guatemalan',
  'Guinean',
  'Guyanese',
  'Haitian',
  'Honduran',
  'Hungarian',
  'Icelandic',
  'Indian',
  'Indonesian',
  'Iranian',
  'Iraqi',
  'Irish',
  'Israeli',
  'Italian',
  'Ivorian',
  'Jamaican',
  'Japanese',
  'Jordanian',
  'Kazakh',
  'Kenyan',
  'Kiribati',
  'Kuwaiti',
  'Kyrgyz',
  'Lao',
  'Latvian',
  'Lebanese',
  'Lesotho',
  'Liberian',
  'Libyan',
  'Liechtensteiner',
  'Lithuanian',
  'Luxembourgish',
  'Madagascan',
  'Malawian',
  'Malaysian',
  'Maldivian',
  'Malian',
  'Maltese',
  'Marshallese',
  'Mauritanian',
  'Mauritian',
  'Mexican',
  'Micronesian',
  'Moldovan',
  'Monacan',
  'Mongolian',
  'Montenegrin',
  'Moroccan',
  'Mozambican',
  'Namibian',
  'Nauruan',
  'Nepalese',
  'New Zealander',
  'Nicaraguan',
  'Nigerian',
  'Nigerien',
  'North Macedonian',
  'Norwegian',
  'Omani',
  'Pakistani',
  'Palauan',
  'Panamanian',
  'Papua New Guinean',
  'Paraguayan',
  'Peruvian',
  'Philippine',
  'Polish',
  'Portuguese',
  'Qatari',
  'Romanian',
  'Russian',
  'Rwandan',
  'Saint Lucian',
  'Salvadoran',
  'Samoan',
  'San Marinese',
  'Sao Tomean',
  'Saudi',
  'Scottish',
  'Senegalese',
  'Serbian',
  'Seychellois',
  'Sierra Leonean',
  'Singaporean',
  'Slovak',
  'Slovenian',
  'Solomon Islander',
  'Somali',
  'South African',
  'South Korean',
  'South Sudanese',
  'Spanish',
  'Sri Lankan',
  'Sudanese',
  'Surinamese',
  'Swazi',
  'Swedish',
  'Swiss',
  'Syrian',
  'Tajik',
  'Tanzanian',
  'Thai',
  'Togolese',
  'Tongan',
  'Trinidadian or Tobagonian',
  'Tunisian',
  'Turkish',
  'Turkmen',
  'Tuvaluan',
  'Ugandan',
  'Ukrainian',
  'Uruguayan',
  'Uzbek',
  'Vanuatuan',
  'Vatican',
  'Venezuelan',
  'Vietnamese',
  'Welsh',
  'Yemeni',
  'Zambian',
  'Zimbabwean'
];

const Field = ({ label, value }: { label: string; value?: string | number | boolean | null }) => (
  <div className="info-field">
    <p className="label">{label}</p>
    <p className="value">{formatValue(value)}</p>
  </div>
);

type FieldPath = (keyof MemberDetail | string)[];

const getValueAtPath = (source: MemberDetail | null, path: FieldPath) =>
  path.reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source ?? undefined);

export const Profile = ({ member, isLoading, errorMessage, onRetry }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MemberDetail | null>(member);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [disabilityTypes, setDisabilityTypes] = useState<DisabilityTypeOption[]>([]);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  useEffect(() => {
    const loadDisabilityTypes = async () => {
      try {
        const res = await apiClient.get<DisabilityTypeOption[]>('api/DisabilityTypes', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setDisabilityTypes(res.data);
      } catch (e) {
        console.error('Error loading disability types:', e);
        setDisabilityTypes([]);
      }
    };

    loadDisabilityTypes();
  }, []);

  useEffect(() => {
    setFormData(member);
    setIsEditing(false);
    setSaveError(null);
    setActiveFieldId(null);
  }, [member]);

  useEffect(() => {
    if (!isEditing || !activeFieldId) return;

    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement?.id === activeFieldId) return;

    const target = document.getElementById(activeFieldId) as
      | HTMLInputElement
      | HTMLSelectElement
      | null;

    if (target) {
      target.focus({ preventScroll: true });
      if (target instanceof HTMLInputElement && target.setSelectionRange && target.type !== 'date') {
        const length = target.value.length;
        target.setSelectionRange(length, length);
      }
    }
  }, [activeFieldId, formData, isEditing]);

  const displayMember = useMemo(() => (isEditing ? formData : member), [formData, member, isEditing]);

  const handleFieldChange = (path: FieldPath, value: unknown) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const updated: MemberDetail = JSON.parse(JSON.stringify(prev));
      let cursor: Record<string, unknown> = updated as unknown as Record<string, unknown>;
      path.forEach((key, index) => {
        if (index === path.length - 1) {
          cursor[key] = value;
        } else {
          cursor[key] = cursor[key] ?? {};
          cursor = cursor[key] as Record<string, unknown>;
        }
      });
      return updated;
    });
  };

  const resolveDisabilityInfo = (disability: MemberDetail['disabilityType']) => {
    const typed = disability as Record<string, unknown> | null;
    const selectedId =
      (typed?.id as string | undefined) ??
      (typed?.disabilityId as string | undefined) ??
      (typed?.DisabilityId as string | undefined) ??
      '';

    const fallbackName =
      (typed?.description as string | undefined) ??
      (typed?.disabilityName as string | undefined) ??
      (typed?.DisabilityName as string | undefined) ??
      '';

    const fallbackCondition =
      (typed?.medCondition as string | undefined) ?? (typed?.MedCondition as string | undefined) ?? '';
    const fallbackMobility =
      (typed?.mobilitySupport as boolean | undefined) ??
      (typed?.MobilitySupport as boolean | undefined);

    const matched = selectedId
      ? disabilityTypes.find((item) => item.DisabilityId === selectedId)
      : undefined;

    return {
      id: matched?.DisabilityId ?? selectedId,
      name: matched?.DisabilityName ?? fallbackName,
      medCondition: matched?.MedCondition ?? fallbackCondition,
      mobilitySupport:
        matched?.MobilitySupport ??
        (fallbackMobility !== undefined ? fallbackMobility : undefined)
    };
  };

  const DisabilityField = () => {
    const resolved = resolveDisabilityInfo(displayMember?.disabilityType);
    const currentId = resolved.id ?? '';

    if (!isEditing) {
      return <Field label="Disability Type" value={resolved.name || null} />;
    }

    return (
      <div className="info-field editable">
        <label className="label" htmlFor="disability-type">
          Disability Type
        </label>
        <select
          id="disability-type"
          value={currentId}
          onFocus={() => setActiveFieldId('disability-type')}
          onChange={(event) => {
            const selected = disabilityTypes.find((item) => item.DisabilityId === event.target.value);
            if (!selected) {
              handleFieldChange(['disabilityType'], null);
              return;
            }

            handleFieldChange(['disabilityType'], {
              id: selected.DisabilityId,
              description: selected.DisabilityName,
              medCondition: selected.MedCondition,
              mobilitySupport: selected.MobilitySupport
            });
          }}
        >
          <option value="">Select a disability type</option>
          {disabilityTypes.map((option) => (
            <option key={option.DisabilityId} value={option.DisabilityId}>
              {option.DisabilityName}
            </option>
          ))}
        </select>
        {resolved.name && (
          <div className="field-note">
            {resolved.medCondition && <p>Medical condition: {resolved.medCondition}</p>}
            {resolved.mobilitySupport !== undefined && (
              <p>Mobility support: {resolved.mobilitySupport ? 'Yes' : 'No'}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const EditableField = ({
    label,
    path,
    type = 'text',
    options,
    readOnly = false
  }: {
    label: string;
    path: FieldPath;
    type?: 'text' | 'date' | 'boolean' | 'select';
    options?: string[];
    readOnly?: boolean;
  }) => {
    const rawValue = getValueAtPath(displayMember, path);

    if (!isEditing) {
      return <Field label={label} value={rawValue as string | number | boolean | null | undefined} />;
    }

    if (readOnly) {
      return <Field label={label} value={rawValue as string | number | boolean | null | undefined} />;
    }

    const id = path.join('-');
    const currentValue = rawValue ?? (type === 'boolean' ? false : '');

    if (type === 'boolean') {
      return (
        <div className="info-field editable">
          <label className="label" htmlFor={id}>
            {label}
          </label>
          <select
            id={id}
            value={String(currentValue)}
            onFocus={() => setActiveFieldId(id)}
            onChange={(event) => handleFieldChange(path, event.target.value === 'true')}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      );
    }

    if (type === 'select' && options) {
      return (
        <div className="info-field editable">
          <label className="label" htmlFor={id}>
            {label}
          </label>
          <select
            id={id}
            value={String(currentValue)}
            onFocus={() => setActiveFieldId(id)}
            onChange={(event) => handleFieldChange(path, event.target.value)}
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className="info-field editable">
        <label className="label" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          type={type === 'date' ? 'date' : 'text'}
          value={type === 'date' ? toDateInputValue(currentValue) : String(currentValue)}
          onFocus={() => setActiveFieldId(id)}
          onChange={(event) => handleFieldChange(path, event.target.value)}
        />
      </div>
    );
  };

  const startEditing = () => {
    setFormData(member);
    setIsEditing(true);
    setActiveFieldId(null);
  };

  const handleCancelEdit = () => {
    setFormData(member);
    setIsEditing(false);
    setSaveError(null);
    setActiveFieldId(null);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!formData) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      await updateMyDetails(formData);
      setIsEditing(false);
      await onRetry();
    } catch (error) {
      console.error('Unable to save profile', error);
      setSaveError('Unable to save your changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Loading</p>
          <h1>Fetching your profile…</h1>
        </div>
        <p>We&apos;re retrieving your membership information. This should only take a moment.</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Error</p>
          <h1>We couldn&apos;t load your profile</h1>
        </div>
        <p className="error">{errorMessage}</p>
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      </section>
    );
  }

  if (!displayMember) {
    return (
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">No data</p>
          <h1>No profile details found</h1>
        </div>
        <p>We couldn&apos;t find any profile information. Please try reloading your details.</p>
        <button type="button" onClick={onRetry}>
          Reload profile
        </button>
      </section>
    );
  }

  const disabilityInfo = resolveDisabilityInfo(displayMember.disabilityType);

  return (
    <form className={`panel profile-panel ${isEditing ? 'is-editing' : ''}`} onSubmit={handleSave}>
      <div className="profile-hero">
        <div className="hero-left">
          <div className="avatar-wrap">
            {displayMember.profilePicture?.url ? (
              <img className="avatar" src={displayMember.profilePicture.url} alt="Profile" />
            ) : (
              <div className="avatar placeholder">{displayMember.firstName?.[0]}</div>
            )}
          </div>
          <div>
            <p className="eyebrow">My profile</p>
            <h1>
              {displayMember.title ? `${displayMember.title} ` : ''}
              {displayMember.firstName} {displayMember.lastName}
            </h1>
            <p className="muted">These details come directly from your church membership record.</p>
            <div className="chip-row">
              <span className="chip">Joined: {formatValue(displayMember.dateOfJoining)}</span>
              <span className={`chip ${displayMember.disabled ? 'accent' : ''}`}>
                {displayMember.disabled ? 'Status: Disabled' : 'Status: Active'}
              </span>
              {displayMember.disabled && disabilityInfo.name && (
                <span className="chip subtle">Disability: {disabilityInfo.name}</span>
              )}
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="highlight-card">
            <p className="label">Local Assembly</p>
            <p className="value emphasis">{formatValue(displayMember.localAssembly?.assemblyName)}</p>
            <p className="muted">
              {formatValue(displayMember.localAssembly?.langSpoken)} | {formatValue(displayMember.localAssembly?.assemblyType)}
            </p>
          </div>
          <div className="highlight-card">
            <p className="label">Contact</p>
            <p className="value emphasis">{formatValue(displayMember.mobileNumber || displayMember.telNumber)}</p>
            <p className="muted">{formatValue(displayMember.emailAddress)}</p>
          </div>
          <div className="hero-actions">
            {isEditing ? (
              <div className="editing-pill">Editing mode</div>
            ) : (
              <button type="button" onClick={startEditing}>
                Edit profile
              </button>
            )}
          </div>
        </div>
      </div>

      {saveError && <p className="error">{saveError}</p>}

      <div className="section-grid">
        <div className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Personal</p>
            <h2>Who you are</h2>
          </div>
          <div className="grid two-columns">
            <EditableField label="First Name" path={['firstName']} />
            <EditableField label="Middle Name" path={['middleName']} />
            <EditableField label="Last Name" path={['lastName']} />
            <EditableField label="Title" path={['title']} />
            <EditableField label="Date of Birth" path={['dob']} type="date" />
            <EditableField
              label="Gender"
              path={['gender']}
              type="select"
              options={['Male', 'Female']}
            />
            <EditableField
              label="Marital Status"
              path={['maritalStatus']}
              type="select"
              options={['Married', 'Single', 'Divorced', 'Widowed']}
            />
            <EditableField label="Nationality" path={['nationality']} type="select" options={NATIONALITIES} />
            <EditableField
              label="Country of Birth"
              path={['countryOfBirth']}
              type="select"
              options={COUNTRIES}
            />
            <EditableField
              label="Country of Residence"
              path={['countryOfResidence']}
              type="select"
              options={COUNTRIES}
            />
            <EditableField label="Birth Place" path={['birthPlace']} />
            <EditableField label="Home Town" path={['homeTown']} />
            <EditableField label="Child" path={['childFlag']} type="boolean" />
            <EditableField label="Disabled" path={['disabled']} type="boolean" />
            {(displayMember.disabled || isEditing) && (
              <DisabilityField />
            )}
          </div>
        </div>

        <div className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Contact</p>
            <h2>How to reach you</h2>
          </div>
          <div className="grid two-columns">
            <EditableField label="Email" path={['emailAddress']} />
            <EditableField label="Mobile" path={['mobileNumber']} />
            <EditableField label="Telephone" path={['telNumber']} />
            <EditableField label="Emergency Contact" path={['emergencyContact']} />
          </div>
          <div className="section-subheading">Home address</div>
          <div className="grid two-columns">
            <EditableField label="Address Line 1" path={['memberAddress', 'addressLine1']} />
            <EditableField label="Address Line 2" path={['memberAddress', 'addressLine2']} />
            <EditableField label="Locality" path={['memberAddress', 'locality']} />
            <EditableField label="City" path={['memberAddress', 'city']} />
            <EditableField label="Region" path={['memberAddress', 'region']} />
            <EditableField label="Postal Code" path={['memberAddress', 'postalCode']} />
            <EditableField
              label="Country"
              path={['memberAddress', 'country']}
              type="select"
              options={COUNTRIES}
            />
          </div>
        </div>

        <div className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Church</p>
            <h2>Your community</h2>
          </div>
          <div className="grid two-columns">
            <EditableField
              label="Local Assembly"
              path={['localAssembly', 'assemblyName']}
              readOnly
            />
            <EditableField label="Language Spoken" path={['localAssembly', 'langSpoken']} readOnly />
            <EditableField label="Assembly Type" path={['localAssembly', 'assemblyType']} readOnly />
          </div>
          <div className="section-subheading">Assembly address</div>
          <div className="grid two-columns">
            <EditableField
              label="Address Line 1"
              path={['localAssembly', 'assemblyAddress', 'addressLine1']}
              readOnly
            />
            <EditableField
              label="Address Line 2"
              path={['localAssembly', 'assemblyAddress', 'addressLine2']}
              readOnly
            />
            <EditableField label="City" path={['localAssembly', 'assemblyAddress', 'city']} readOnly />
            <EditableField label="Region" path={['localAssembly', 'assemblyAddress', 'region']} readOnly />
            <EditableField label="Postal Code" path={['localAssembly', 'assemblyAddress', 'postalCode']} readOnly />
            <EditableField label="Country" path={['localAssembly', 'assemblyAddress', 'country']} readOnly />
          </div>
          <div className="section-subheading">District</div>
          <div className="grid two-columns">
            <EditableField
              label="District Name"
              path={['localAssembly', 'district', 'districtName']}
              readOnly
            />
            <EditableField
              label="District Description"
              path={['localAssembly', 'district', 'description']}
              readOnly
            />
          </div>
        </div>

        <div className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Journey</p>
            <h2>Faith & milestones</h2>
          </div>
          <div className="grid two-columns">
            <EditableField label="Salvation Status" path={['salvationStatus', 'salvationStatusText']} />
            <EditableField label="Date" path={['salvationStatus', 'date']} type="date" />
            <EditableField label="Officiating Minister" path={['salvationStatus', 'officiatingMinister']} />
            <EditableField label="Communicant" path={['salvationStatus', 'communicantBool']} type="boolean" />
            <EditableField label="External Assembly" path={['salvationStatus', 'externalAssembly']} type="boolean" />
            <EditableField label="Dedication Date" path={['dedicationDate']} type="date" />
            <EditableField label="Water Baptised" path={['waterBaptised']} type="boolean" />
            <EditableField label="Holy Spirit Baptised" path={['hsBaptised']} type="boolean" />
          </div>
          <div className="section-subheading">Baptism Entries</div>
          {displayMember.baptismStatus?.length ? (
            <div className="grid two-columns">
              {displayMember.baptismStatus.map((status, index) => (
                <div key={`${status.description}-${index}`} className="info-field emphasis-card">
                  <p className="label">Entry {index + 1}</p>
                  <p className="value">{formatValue(status.description)}</p>
                  <p className="value subtle">{formatValue(status.date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No baptism status recorded.</p>
          )}
        </div>

        <div className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Connections</p>
            <h2>Home cell & other details</h2>
          </div>
          <div className="grid two-columns">
            <EditableField label="Home Cell Name" path={['homeCell', 'name']} />
            <EditableField label="Profession Category" path={['profCat', 'name']} />
            <EditableField label="Profession" path={['profession']} />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="floating-footer">
          <div className="footer-context">
            <p className="eyebrow">Editing your profile</p>
            <p className="muted">Review your updates before submitting.</p>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Submitting…' : 'Submit'}
            </button>
            <button type="button" className="secondary" onClick={handleCancelEdit} disabled={isSaving}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
