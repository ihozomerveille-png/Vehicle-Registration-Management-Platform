import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVehicle } from '../services/api';

const currentYear = new Date().getFullYear();

const vehicleSchema = z.object({
  manufacture: z.string().trim().min(1),
  model: z.string().trim().min(1),
  bodyType: z.string().trim().min(1),
  color: z.string().trim().min(1),
  year: z.number().int().gte(1886).lte(currentYear + 1),
  vehicleType: z.enum(['ELECTRIC','SUV','TRUCK','MOTORCYCLE','BUS','VAN','PICKUP','OTHER']),
  fuelType: z.enum(['PETROL','DIESEL','ELECTRIC','HYBRID','GAS','OTHER']),
  vehiclePurpose: z.enum(['PERSONAL','COMMERCIAL','TAXI','GOVERNMENT']),
  vehicleStatus: z.enum(['NEW','USED','REBUILT']),
  ownerType: z.enum(['INDIVIDUAL','COMPANY','NGO','GOVERNMENT']),
  ownerName: z.string().trim().min(1),
  address: z.string().trim().min(1),
  nationalId: z.string().regex(/^\d{16}$/),
  mobile: z.string().regex(/^\d{10}$/),
  email: z.string().email(),
  companyRegNumber: z.string().optional(),
  passportNumber: z.string().optional(),
  plateNumber: z.string().regex(/^(R[A-Z]{2}|GR|CD)\s?\d{3}\s?[A-Z]?$/i),
  registrationDate: z.string().refine((v) => !Number.isNaN(Date.parse(v))),
  expiryDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)) && new Date(v) > new Date()),
  insuranceExpiryDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)) && new Date(v) > new Date()),
  policyNumber: z.string().trim().min(1),
  companyName: z.string().trim().min(1),
  insuranceType: z.string().trim().min(1),
  roadworthyCert: z.string().trim().min(1),
  customsRef: z.string().trim().min(1),
  proofOfOwnership: z.string().trim().min(1),
  state: z.string().trim().min(1)
}).superRefine((data, ctx) => {
  if (data.ownerType === 'COMPANY' && !data.companyRegNumber?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Company registration number is required for company owners', path: ['companyRegNumber'] });
  }
  if (data.passportNumber !== undefined && data.passportNumber.trim() === '') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Passport number cannot be empty if provided', path: ['passportNumber'] });
  }
});

const VehicleNew = () => {
  const [step, setStep] = useState(1);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(vehicleSchema),
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      navigate('/dashboard');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, year: Number(data.year) });
  };

  const ownerType = watch('ownerType');

  const buttons = (
    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
      {step > 1 && <button type="button" onClick={() => setStep(step - 1)}>Back</button>}
      {step < 3 && <button type="button" onClick={() => setStep(step + 1)}>Next</button>}
      {step === 3 && <button type="button" onClick={handleSubmit(onSubmit)}>Submit</button>}
    </div>
  );

  const errorMsg = (field) => errors[field] ? <div className="error">{errors[field].message}</div> : null;

  return (
    <div className="card">
      <h1>Register New Vehicle</h1>
      <form>
        {step === 1 && (
          <>
            <h3>Vehicle Info</h3>
            <label>Manufacture</label>
            <Controller name="manufacture" control={control} render={({ field }) => <input {...field} />} />{errorMsg('manufacture')}
            <label>Model</label>
            <Controller name="model" control={control} render={({ field }) => <input {...field} />} />{errorMsg('model')}
            <label>Body Type</label>
            <Controller name="bodyType" control={control} render={({ field }) => <input {...field} />} />{errorMsg('bodyType')}
            <label>Color</label>
            <Controller name="color" control={control} render={({ field }) => <input {...field} />} />{errorMsg('color')}
            <label>Year</label>
            <Controller name="year" control={control} render={({ field }) => <input {...field} type="number" />} />{errorMsg('year')}
            <label>Vehicle Type</label>
            <Controller name="vehicleType" control={control} render={({ field }) => (
              <select {...field}>
                <option value="">Select</option>
                {['ELECTRIC','SUV','TRUCK','MOTORCYCLE','BUS','VAN','PICKUP','OTHER'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            )} />{errorMsg('vehicleType')}
            <label>Fuel Type</label>
            <Controller name="fuelType" control={control} render={({ field }) => (
              <select {...field}>
                <option value="">Select</option>
                {['PETROL','DIESEL','ELECTRIC','HYBRID','GAS','OTHER'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            )} />{errorMsg('fuelType')}
            <label>Purpose</label>
            <Controller name="vehiclePurpose" control={control} render={({ field }) => (
              <select {...field}>
                <option value="">Select</option>
                {['PERSONAL','COMMERCIAL','TAXI','GOVERNMENT'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            )} />{errorMsg('vehiclePurpose')}
            <label>Status</label>
            <Controller name="vehicleStatus" control={control} render={({ field }) => (
              <select {...field}>
                <option value="">Select</option>
                {['NEW','USED','REBUILT'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            )} />{errorMsg('vehicleStatus')}
          </>
        )}

        {step === 2 && (
          <>
            <h3>Owner Info</h3>
            <label>Owner Name</label>
            <Controller name="ownerName" control={control} render={({ field }) => <input {...field} />} />{errorMsg('ownerName')}
            <label>Address</label>
            <Controller name="address" control={control} render={({ field }) => <input {...field} />} />{errorMsg('address')}
            <label>Owner Type</label>
            <Controller name="ownerType" control={control} render={({ field }) => (
              <select {...field}>
                <option value="">Select</option>
                {['INDIVIDUAL','COMPANY','NGO','GOVERNMENT'].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            )} />{errorMsg('ownerType')}
            {ownerType === 'COMPANY' && (
              <>
                <label>Company Registration Number</label>
                <Controller name="companyRegNumber" control={control} render={({ field }) => <input {...field} />} />{errorMsg('companyRegNumber')}
              </>
            )}
            <label>National ID</label>
            <Controller name="nationalId" control={control} render={({ field }) => <input {...field} />} />{errorMsg('nationalId')}
            <label>Mobile Number</label>
            <Controller name="mobile" control={control} render={({ field }) => <input {...field} />} />{errorMsg('mobile')}
            <label>Email</label>
            <Controller name="email" control={control} render={({ field }) => <input {...field} />} />{errorMsg('email')}
            <label>Passport Number (optional)</label>
            <Controller name="passportNumber" control={control} render={({ field }) => <input {...field} />} />{errorMsg('passportNumber')}
          </>
        )}

        {step === 3 && (
          <>
            <h3>Registration & Insurance</h3>
            <label>Plate Number</label>
            <Controller name="plateNumber" control={control} render={({ field }) => <input {...field} />} />{errorMsg('plateNumber')}
            <label>Registration Date</label>
            <Controller name="registrationDate" control={control} render={({ field }) => <input {...field} type="datetime-local" />} />{errorMsg('registrationDate')}
            <label>Registration Expiry Date</label>
            <Controller name="expiryDate" control={control} render={({ field }) => <input {...field} type="datetime-local" />} />{errorMsg('expiryDate')}
            <label>Insurance Expiry Date</label>
            <Controller name="insuranceExpiryDate" control={control} render={({ field }) => <input {...field} type="datetime-local" />} />{errorMsg('insuranceExpiryDate')}
            <label>Policy Number</label>
            <Controller name="policyNumber" control={control} render={({ field }) => <input {...field} />} />{errorMsg('policyNumber')}
            <label>Company Name</label>
            <Controller name="companyName" control={control} render={({ field }) => <input {...field} />} />{errorMsg('companyName')}
            <label>Insurance Type</label>
            <Controller name="insuranceType" control={control} render={({ field }) => <input {...field} />} />{errorMsg('insuranceType')}
            <label>Roadworthy Cert</label>
            <Controller name="roadworthyCert" control={control} render={({ field }) => <input {...field} />} />{errorMsg('roadworthyCert')}
            <label>Customs Ref</label>
            <Controller name="customsRef" control={control} render={({ field }) => <input {...field} />} />{errorMsg('customsRef')}
            <label>Proof of Ownership</label>
            <Controller name="proofOfOwnership" control={control} render={({ field }) => <input {...field} />} />{errorMsg('proofOfOwnership')}
            <label>State</label>
            <Controller name="state" control={control} render={({ field }) => <input {...field} />} />{errorMsg('state')}
          </>
        )}

        {buttons}
        {mutation.isError && <div className="error">Error: {mutation.error.message || 'server failure'}</div>}
        {mutation.isLoading && <div>Submitting...</div>}
      </form>
    </div>
  );
};

export default VehicleNew;
