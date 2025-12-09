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
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">My profile</p>
          <h1>
            {member.title ? `${member.title} ` : ''}
            {member.firstName} {member.lastName}
          </h1>
          <p>These details come directly from your church membership record.</p>
        </div>
        {member.profilePicture?.url && (
          <img className="avatar" src={member.profilePicture.url} alt="Profile" />
        )}
      </div>
      <div className="stacked">
        <div className="grid two-columns">
          <Field label="Member ID" value={member.memberId} />
          <Field label="Title" value={member.title} />
          <Field label="First Name" value={member.firstName} />
          <Field label="Middle Name" value={member.middleName} />
          <Field label="Last Name" value={member.lastName} />
          <Field label="Date of Birth" value={member.dob} />
          <Field label="Gender" value={member.gender} />
          <Field label="Nationality" value={member.nationality} />
          <Field label="Country of Birth" value={member.countryOfBirth} />
          <Field label="Country of Residence" value={member.countryOfResidence} />
          <Field label="Marital Status" value={member.maritalStatus} />
          <Field label="Profession" value={member.profession} />
          <Field label="Church Status" value={member.churchStatus} />
          <Field label="Child" value={member.childFlag} />
          <Field label="Disabled" value={member.disabled} />
          <Field label="Date of Joining" value={member.dateOfJoining} />
          <Field label="Birth Place" value={member.birthPlace} />
          <Field label="Home Town" value={member.homeTown} />
          <Field label="Dedication Date" value={member.dedicationDate} />
          <Field label="Water Baptised" value={member.waterBaptised} />
          <Field label="Holy Spirit Baptised" value={member.hsBaptised} />
        </div>

        <h2 className="section-heading">Contact</h2>
        <div className="grid two-columns">
          <Field label="Email" value={member.emailAddress} />
          <Field label="Mobile" value={member.mobileNumber} />
          <Field label="Telephone" value={member.telNumber} />
          <Field label="Emergency Contact" value={member.emergencyContact} />
        </div>

        <h2 className="section-heading">Address</h2>
        <div className="grid two-columns">
          <Field label="Address Line 1" value={member.memberAddress?.addressLine1} />
          <Field label="Address Line 2" value={member.memberAddress?.addressLine2} />
          <Field label="Locality" value={member.memberAddress?.locality} />
          <Field label="City" value={member.memberAddress?.city} />
          <Field label="Region" value={member.memberAddress?.region} />
          <Field label="Postal Code" value={member.memberAddress?.postalCode} />
          <Field label="Country" value={member.memberAddress?.country} />
        </div>

        <h2 className="section-heading">Local Assembly</h2>
        <div className="grid two-columns">
          <Field label="Assembly Name" value={member.localAssembly?.assemblyName} />
          <Field label="Language Spoken" value={member.localAssembly?.langSpoken} />
          <Field label="Assembly Type" value={member.localAssembly?.assemblyType} />
          <Field label="Assembly ID" value={member.localAssembly?.assemblyId} />
          <Field label="Assembly User ID" value={member.localAssembly?.userId} />
          <Field label="Assembly Type ID" value={member.localAssembly?.assemblyTypeId} />
        </div>
        <div className="grid two-columns">
          <Field label="Assembly Address Line 1" value={member.localAssembly?.assemblyAddress?.addressLine1} />
          <Field label="Assembly Address Line 2" value={member.localAssembly?.assemblyAddress?.addressLine2} />
          <Field label="Assembly City" value={member.localAssembly?.assemblyAddress?.city} />
          <Field label="Assembly Region" value={member.localAssembly?.assemblyAddress?.region} />
          <Field label="Assembly Postal Code" value={member.localAssembly?.assemblyAddress?.postalCode} />
          <Field label="Assembly Country" value={member.localAssembly?.assemblyAddress?.country} />
        </div>

        <h2 className="section-heading">District</h2>
        <div className="grid two-columns">
          <Field label="District Name" value={member.localAssembly?.district?.districtName} />
          <Field label="District ID" value={member.localAssembly?.district?.districtId} />
          <Field label="District Description" value={member.localAssembly?.district?.description} />
          <Field label="District Address" value={member.localAssembly?.district?.districtAddress} />
          <Field label="District User ID" value={member.localAssembly?.district?.userId} />
          <Field label="Area ID" value={member.localAssembly?.district?.areaId} />
        </div>

        <h2 className="section-heading">Salvation Status</h2>
        <div className="grid two-columns">
          <Field label="Assurance ID" value={member.salvationStatus?.assuranceId} />
          <Field label="Status" value={member.salvationStatus?.salvationStatusText} />
          <Field label="Date" value={member.salvationStatus?.date} />
          <Field label="Officiating Minister" value={member.salvationStatus?.officiatingMinister} />
          <Field label="Communicant" value={member.salvationStatus?.communicantBool} />
          <Field label="External Assembly" value={member.salvationStatus?.externalAssembly} />
        </div>

        <h2 className="section-heading">Baptism Status</h2>
        {member.baptismStatus?.length ? (
          <div className="grid two-columns">
            {member.baptismStatus.map((status, index) => (
              <div key={`${status.description}-${index}`} className="info-field">
                <p className="label">Entry {index + 1}</p>
                <p className="value">{formatValue(status.description)}</p>
                <p className="value subtle">{formatValue(status.date)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No baptism status recorded.</p>
        )}

        <h2 className="section-heading">Home Cell</h2>
        <div className="grid two-columns">
          <Field label="Home Cell Name" value={member.homeCell?.name} />
          <Field label="Home Cell ID" value={member.homeCell?.id} />
        </div>

        <h2 className="section-heading">Other Details</h2>
        <div className="grid two-columns">
          <Field label="Disability Type" value={member.disabilityType?.description} />
          <Field label="Profession Category" value={member.profCat?.name} />
        </div>
      </div>
    </section>
  );
};
