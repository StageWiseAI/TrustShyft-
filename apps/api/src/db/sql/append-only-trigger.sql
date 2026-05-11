-- TrustShyft Phase 1: enforce append-only semantics on audit.oversight_records.
--
-- This trigger MUST be installed in every environment. The Drizzle schema
-- alone cannot express "no UPDATE, no DELETE", so we enforce it at the DB.

CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION audit.reject_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION
    'audit.oversight_records is append-only; % is not permitted',
    TG_OP
    USING ERRCODE = 'check_violation';
END;
$$;

DROP TRIGGER IF EXISTS oversight_records_no_update ON audit.oversight_records;
CREATE TRIGGER oversight_records_no_update
BEFORE UPDATE ON audit.oversight_records
FOR EACH ROW EXECUTE FUNCTION audit.reject_mutation();

DROP TRIGGER IF EXISTS oversight_records_no_delete ON audit.oversight_records;
CREATE TRIGGER oversight_records_no_delete
BEFORE DELETE ON audit.oversight_records
FOR EACH ROW EXECUTE FUNCTION audit.reject_mutation();
