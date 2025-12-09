import { MemberDetail } from '../types/member';

interface ProfileProps {
  member: MemberDetail | null;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
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

export const Profile = ({ member, isLoading, errorMessage, onRetry }: ProfileProps) => {
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

  if (!member) {
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
    <section className="panel profile-panel">
      <div className="profile-hero">
        <div className="hero-left">
          <div className="avatar-wrap">
            {member.profilePicture?.url ? (
              <img className="avatar" src={member.profilePicture.url} alt="Profile" />
            ) : (
              <div className="avatar placeholder">{member.firstName?.[0]}</div>
            )}
          </div>
          <div>
            <p className="eyebrow">My profile</p>
            <h1>
              {member.title ? `${member.title} ` : ''}
              {member.firstName} {member.lastName}
            </h1>
            <p className="muted">These details come directly from your church membership record.</p>
            <div className="chip-row">
              <span className="chip">Joined: {formatValue(member.dateOfJoining)}</span>
              <span className={`chip ${member.disabled ? 'accent' : ''}`}>
                {member.disabled ? 'Status: Disabled' : 'Status: Active'}
              </span>
              {member.disabled && member.disabilityType?.description && (
                <span className="chip subtle">Disability: {member.disabilityType.description}</span>
              )}
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="highlight-card">
            <p className="label">Local Assembly</p>
            <p className="value emphasis">{formatValue(member.localAssembly?.assemblyName)}</p>
            <p className="muted">{formatValue(member.localAssembly?.langSpoken)} | {formatValue(member.localAssembly?.assemblyType)}</p>
          </div>
          <div className="highlight-card">
            <p className="label">Contact</p>
            <p className="value emphasis">{formatValue(member.mobileNumber || member.telNumber)}</p>
            <p className="muted">{formatValue(member.emailAddress)}</p>
          </div>
        </div>
      </div>

      <div className="section-grid">
        <div className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Personal</p>
            <h2>Who you are</h2>
          </div>
          <div className="grid two-columns">
            <Field label="First Name" value={member.firstName} />
            <Field label="Middle Name" value={member.middleName} />
            <Field label="Last Name" value={member.lastName} />
            <Field label="Title" value={member.title} />
            <Field label="Date of Birth" value={member.dob} />
            <Field label="Gender" value={member.gender} />
            <Field label="Marital Status" value={member.maritalStatus} />
            <Field label="Nationality" value={member.nationality} />
            <Field label="Country of Birth" value={member.countryOfBirth} />
            <Field label="Country of Residence" value={member.countryOfResidence} />
            <Field label="Birth Place" value={member.birthPlace} />
            <Field label="Home Town" value={member.homeTown} />
            <Field label="Child" value={member.childFlag} />
            <Field label="Disabled" value={member.disabled} />
            {member.disabled && (
              <Field label="Disability Type" value={member.disabilityType?.description} />
            )}
          </div>
        </div>

        <div className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Contact</p>
            <h2>How to reach you</h2>
          </div>
          <div className="grid two-columns">
            <Field label="Email" value={member.emailAddress} />
            <Field label="Mobile" value={member.mobileNumber} />
            <Field label="Telephone" value={member.telNumber} />
            <Field label="Emergency Contact" value={member.emergencyContact} />
          </div>
          <div className="section-subheading">Home address</div>
          <div className="grid two-columns">
            <Field label="Address Line 1" value={member.memberAddress?.addressLine1} />
            <Field label="Address Line 2" value={member.memberAddress?.addressLine2} />
            <Field label="Locality" value={member.memberAddress?.locality} />
            <Field label="City" value={member.memberAddress?.city} />
            <Field label="Region" value={member.memberAddress?.region} />
            <Field label="Postal Code" value={member.memberAddress?.postalCode} />
            <Field label="Country" value={member.memberAddress?.country} />
          </div>
        </div>

        <div className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Church</p>
            <h2>Your community</h2>
          </div>
          <div className="grid two-columns">
            <Field label="Local Assembly" value={member.localAssembly?.assemblyName} />
            <Field label="Language Spoken" value={member.localAssembly?.langSpoken} />
            <Field label="Assembly Type" value={member.localAssembly?.assemblyType} />
          </div>
          <div className="section-subheading">Assembly address</div>
          <div className="grid two-columns">
            <Field label="Address Line 1" value={member.localAssembly?.assemblyAddress?.addressLine1} />
            <Field label="Address Line 2" value={member.localAssembly?.assemblyAddress?.addressLine2} />
            <Field label="City" value={member.localAssembly?.assemblyAddress?.city} />
            <Field label="Region" value={member.localAssembly?.assemblyAddress?.region} />
            <Field label="Postal Code" value={member.localAssembly?.assemblyAddress?.postalCode} />
            <Field label="Country" value={member.localAssembly?.assemblyAddress?.country} />
          </div>
          <div className="section-subheading">District</div>
          <div className="grid two-columns">
            <Field label="District Name" value={member.localAssembly?.district?.districtName} />
            <Field label="District Description" value={member.localAssembly?.district?.description} />
          </div>
        </div>

        <div className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Journey</p>
            <h2>Faith & milestones</h2>
          </div>
          <div className="grid two-columns">
            <Field label="Salvation Status" value={member.salvationStatus?.salvationStatusText} />
            <Field label="Date" value={member.salvationStatus?.date} />
            <Field label="Officiating Minister" value={member.salvationStatus?.officiatingMinister} />
            <Field label="Communicant" value={member.salvationStatus?.communicantBool} />
            <Field label="External Assembly" value={member.salvationStatus?.externalAssembly} />
            <Field label="Dedication Date" value={member.dedicationDate} />
            <Field label="Water Baptised" value={member.waterBaptised} />
            <Field label="Holy Spirit Baptised" value={member.hsBaptised} />
          </div>
          <div className="section-subheading">Baptism Entries</div>
          {member.baptismStatus?.length ? (
            <div className="grid two-columns">
              {member.baptismStatus.map((status, index) => (
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
            <Field label="Home Cell Name" value={member.homeCell?.name} />
            <Field label="Profession Category" value={member.profCat?.name} />
            <Field label="Profession" value={member.profession} />
          </div>
        </div>
      </div>
    </section>
  );
};
