import { MemberDetail } from '../types/member';

interface ProfileProps {
  member: MemberDetail | null;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
}


const Field = ({ label, value }: { label: string; value?: string | number | boolean }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="info-field">
      <p className="label">{label}</p>
      <p className="value">{String(value)}</p>
    </div>
  );
};

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
    return null;
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">My profile</p>
          <h1>
            {member.Title ? `${member.Title} ` : ''}
            {member.FirstName} {member.LastName}
          </h1>
          <p>These details come directly from your church membership record.</p>
        </div>
        {member.ProfilePicture?.url && (
          <img className="avatar" src={member.ProfilePicture.url} alt="Profile" />
        )}
      </div>
      <div className="grid two-columns">
        <Field label="Email" value={member.EmailAddress} />
        <Field label="Mobile" value={member.MobileNumber} />
        <Field label="Gender" value={member.Gender} />
        <Field label="Date of Birth" value={member.DOB} />
        <Field label="Nationality" value={member.Nationality} />
        <Field label="Country of Residence" value={member.CountryOfResidence} />
        <Field label="Marital Status" value={member.MaritalStatus} />
        <Field label="Profession" value={member.Profession} />
        <Field label="Church Status" value={member.ChurchStatus} />
        <Field label="Emergency Contact" value={member.EmergencyContact} />
        <Field label="Member ID" value={member.memberId} />
        <Field label="Child" value={member.ChildFlag} />
        <Field label="Disabled" value={member.Disabled} />
        <Field label="Date of Joining" value={member.DateOfJoining} />
        <Field label="Home Town" value={member.HomeTown} />
        <Field label="Birth Place" value={member.BirthPlace} />
      </div>
    </section>
  );
};
