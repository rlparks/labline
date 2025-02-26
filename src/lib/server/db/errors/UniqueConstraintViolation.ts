/**
 * Represents the Error that occurs on attempt to
 * insert a value that violates a UNIQUE constraint.
 */
export class UniqueConstraintViolation extends Error {
	public constraintViolated: string;

	constructor(constraintViolated: string) {
		super();
		this.constraintViolated = constraintViolated;
	}
}
