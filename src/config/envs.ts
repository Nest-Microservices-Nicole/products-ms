import 'dotenv/config';
import * as joi from 'joi';

interface IEnvVars {
    PORT: number;
    DATABASE_URL: string;
}

const envSchema = joi.object<IEnvVars>({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
})
.unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: IEnvVars = value

export const envs = {
    port: envVars.PORT,
    dbUrl: envVars.DATABASE_URL,
};
