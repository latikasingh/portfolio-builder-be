import * as bcrypt from 'bcryptjs';

import * as moment from 'moment';
import mongoose, { FilterQuery } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessage } from 'shared/error.constant';

type Model<T> = mongoose.Model<T>;

// Function to retrieve a single document by its ID
export const getOneById = async <T>(
  model: Model<T>,
  id: mongoose.Types.ObjectId,
): Promise<T | null> => {
  return model.findById(id);
};

// Function to retrieve a single document by other ID
export const getOne = async <T>(
  model: Model<T>,
  id: mongoose.Types.ObjectId,
  key?: string,
): Promise<T | null> => {
  const filter: FilterQuery<T> = { [key]: id } as FilterQuery<T>;
  return model.findOne(filter);
};

// Function to retrieve multiple documents based on options
export const getAll = async <T>(
  model: Model<T>,
  options?: any,
): Promise<T[] | null> => {
  return model.find(options);
};

// Function to create a new document
export const createOne = async <T>(
  model: Model<T>,
  bodyData: any,
): Promise<T | null> => {
  return model.create(bodyData);
};

// Function to update a document by its ID
export const updateOne = async (
  model: any,
  id: mongoose.Types.ObjectId,
  updateData: any,
): Promise<any> => {
  const keys: string[] = Object.keys(updateData);

  // Check if the update data contains sensitive fields like password
  if (keys.includes('password')) {
    throw new BadRequestException(ErrorMessage.PASSWORD_CHANGE_NOT_ALLOWED);
  }
  return await model.findOneAndUpdate(
    { _id: id },
    { $set: updateData },
    { new: true },
  );
};

// Function to update a document by its ID
export const upSertOne = async (
  model: any,
  id: mongoose.Types.ObjectId | null,
  updateData: any,
): Promise<any> => {
  return await model.findOneAndUpdate(
    { _id: id },
    { $set: updateData },
    { upsert: true, new: true },
  );
};

// Function to delete a document by its ID
export const deleteOne = async (
  model: any,
  id: mongoose.Types.ObjectId,
): Promise<string | null> => {
  const deleteData = await model.findByIdAndDelete(id);

  if (!deleteData)
    throw new BadRequestException('Error while Delete operation ');

  return 'Delete Operation done successfully';
};

// Function to bcrypt Password
export const bcryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, parseInt(process.env.SALT));
};

export const calculateAge = (dob: string): number => {
  const birthDate = moment(dob, 'YYYY-MM-DD');
  const today = moment();
  return today.diff(birthDate, 'years');
};
