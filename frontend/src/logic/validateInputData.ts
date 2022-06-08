import Ajv from "ajv";
import snapshotSchema from '../../schemas/Snapshot.json';
import providerSchema from '../../schemas/WeatherProvider.json';
import inputSchema from '../../schemas/Input.json';
import { Input } from '../types/Input';

export const validateInputData = (data: any): Input | null => {
    const ajv = new Ajv()

    ajv.addSchema(snapshotSchema);
    ajv.addSchema(providerSchema);
    const validate = ajv.compile<Input>(inputSchema);

    if (validate(data)) {
        return data
    }
    
    return null
}