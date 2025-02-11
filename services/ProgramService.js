import { Program } from '../models/Program';

export class ProgramService {
    static async getAll(userId) {
        return await Program.find({ userId }).sort({ createdAt: -1 });
    }

    static async create(programData, userId) {
        try {
            const program = new Program({
                userId,
                days: programData
            });
            return await program.save();
        } catch (error) {
            throw error;
        }
    }

    static async update(id, programData, userId) {
        try {
            return await Program.findOneAndUpdate(
                { _id: id, userId },
                { days: programData },
                { new: true }
            );
        } catch (error) {
            throw error;
        }
    }

    static async delete(id, userId) {
        return await Program.findOneAndDelete({ _id: id, userId });
    }
}