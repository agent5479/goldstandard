import { FAMILY_ROLES, TRAINER_PACK_ROLES, type PurposeRoleId } from '../../data/dogPurposeRoles';

export default function RoleSelectGrid({
  onSelect,
}: {
  onSelect: (roleId: PurposeRoleId) => void;
}) {
  return (
    <div className="dog-selector-role-groups">
      <section>
        <p className="section-label">Trainer working pack</p>
        <h2>What job does this dog need to hold?</h2>
        <div className="dog-selector-role-grid">
          {TRAINER_PACK_ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              className="dog-selector-role-card"
              onClick={() => onSelect(role.id)}
            >
              <strong>{role.label}</strong>
              <span>{role.summary}</span>
            </button>
          ))}
        </div>
      </section>
      <section>
        <p className="section-label">Family</p>
        <h2>Household companion jobs</h2>
        <div className="dog-selector-role-grid">
          {FAMILY_ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              className="dog-selector-role-card"
              onClick={() => onSelect(role.id)}
            >
              <strong>{role.label}</strong>
              <span>{role.summary}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
