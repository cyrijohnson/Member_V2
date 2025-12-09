import { FormEvent, useEffect, useMemo, useState } from 'react';
import { MemberDetail } from '../types/member';
import { updateMyDetails } from '../api/member';

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

  useEffect(() => {
    setFormData(member);
    setIsEditing(false);
    setSaveError(null);
  }, [member]);

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

  const EditableField = ({
    label,
    path,
    type = 'text'
  }: {
    label: string;
    path: FieldPath;
    type?: 'text' | 'date' | 'boolean';
  }) => {
    const rawValue = getValueAtPath(displayMember, path);

    if (!isEditing) {
      return <Field label={label} value={rawValue as string | number | boolean | null | undefined} />;
    }

    const id = path.join('-');
    const currentValue = rawValue ?? (type === 'boolean' ? false : '');

    return (
      <div className="info-field editable">
        <label className="label" htmlFor={id}>
          {label}
        </label>
        {type === 'boolean' ? (
          <select
            id={id}
            value={String(currentValue)}
            onChange={(event) => handleFieldChange(path, event.target.value === 'true')}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        ) : (
          <input
            id={id}
            type={type === 'date' ? 'date' : 'text'}
            value={String(currentValue)}
            onChange={(event) => handleFieldChange(path, event.target.value)}
          />
        )}
      </div>
    );
  };

  const startEditing = () => {
    setFormData(member);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(member);
    setIsEditing(false);
    setSaveError(null);
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

  return (
    <form className="panel profile-panel" onSubmit={handleSave}>
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
              {displayMember.disabled && displayMember.disabilityType?.description && (
                <span className="chip subtle">Disability: {displayMember.disabilityType.description}</span>
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
              <div className="form-actions">
                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Submitting…' : 'Submit'}
                </button>
                <button type="button" className="secondary" onClick={handleCancelEdit} disabled={isSaving}>
                  Cancel
                </button>
              </div>
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
            <EditableField label="Gender" path={['gender']} />
            <EditableField label="Marital Status" path={['maritalStatus']} />
            <EditableField label="Nationality" path={['nationality']} />
            <EditableField label="Country of Birth" path={['countryOfBirth']} />
            <EditableField label="Country of Residence" path={['countryOfResidence']} />
            <EditableField label="Birth Place" path={['birthPlace']} />
            <EditableField label="Home Town" path={['homeTown']} />
            <EditableField label="Child" path={['childFlag']} type="boolean" />
            <EditableField label="Disabled" path={['disabled']} type="boolean" />
            {(displayMember.disabled || isEditing) && (
              <EditableField label="Disability Type" path={['disabilityType', 'description']} />
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
            <EditableField label="Country" path={['memberAddress', 'country']} />
          </div>
        </div>

        <div className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Church</p>
            <h2>Your community</h2>
          </div>
          <div className="grid two-columns">
            <EditableField label="Local Assembly" path={['localAssembly', 'assemblyName']} />
            <EditableField label="Language Spoken" path={['localAssembly', 'langSpoken']} />
            <EditableField label="Assembly Type" path={['localAssembly', 'assemblyType']} />
          </div>
          <div className="section-subheading">Assembly address</div>
          <div className="grid two-columns">
            <EditableField label="Address Line 1" path={['localAssembly', 'assemblyAddress', 'addressLine1']} />
            <EditableField label="Address Line 2" path={['localAssembly', 'assemblyAddress', 'addressLine2']} />
            <EditableField label="City" path={['localAssembly', 'assemblyAddress', 'city']} />
            <EditableField label="Region" path={['localAssembly', 'assemblyAddress', 'region']} />
            <EditableField label="Postal Code" path={['localAssembly', 'assemblyAddress', 'postalCode']} />
            <EditableField label="Country" path={['localAssembly', 'assemblyAddress', 'country']} />
          </div>
          <div className="section-subheading">District</div>
          <div className="grid two-columns">
            <EditableField label="District Name" path={['localAssembly', 'district', 'districtName']} />
            <EditableField label="District Description" path={['localAssembly', 'district', 'description']} />
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
    </form>
  );
};
