// WOForm.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "../common/Button";
import FLabel from './FLabel';
import { Label } from '../common/Label';
import { RadioCardGroup, RadioCardIndicator, RadioCardItem } from '../common/RadioCardGroup';
import { Badge } from '../common/Badge';
import { SelectNative } from '../common/SelectNative';
import axios from 'axios';
// If @tremor/react has individual DatePicker components, you can import them here.
// Otherwise, we'll use standard HTML date inputs.

interface WOFormProps {
  initialData?: Task;
  onSubmit: (formData: Task) => void;
  workTypes: { value: string; label: string }[];
  priorities: { value: string; label: string }[];
  users: { value: string; label: string }[];
  onClose: () => void; // Add this new prop
  uploadedFile: File | null; 
}

const TransformDataForm: React.FC<WOFormProps> = ({ initialData, onSubmit, workTypes, priorities, users, onClose, uploadedFile }) => {
  const [formData, setFormData] = useState<Task>(initialData || {
    title: '',
    description: '',
    workType: '',
    priority: '',
    assignee: '',
    dueDate: {
      start: '',
      end: '',
    },
    workOrderNumber: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handlers for separate date fields
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      dueDate: {
        ...prevData.dueDate,
        start: value,
      },
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      dueDate: {
        ...prevData.dueDate,
        end: value,
      },
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form submitted");
    // onSubmit(formData);
    // console.log("onSubmit called");
    // onClose();
    // console.log("onClose called");
    const formData = new FormData();
  formData.append('file', uploadedFile);
  formData.append('selectedOption', selectedOption);
  formData.append('filterSize', inputValues.filterSize);
  formData.append('windowType', inputValues.windowType);
  formData.append('overlap', inputValues.overlap);

  setLoading(true);

  axios.post('http://localhost:5000/api/transform-data', formData, {responseType: 'blob', })
  .then((response) => {
    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    // Create an anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedOption}-transformed.json`; // Dynamic filename
    document.body.appendChild(a);
    a.click();
    a.remove(); // Remove the element after downloading
    window.URL.revokeObjectURL(url); // Free up memory

    console.log('Download initiated for JSON file.');
  })
  .catch((error) => {
    console.error('Error during file download:', error);
  })
  .finally(()=>{
    setLoading(false);
  })
  };


  const [selectedOption, setSelectedOption] = React.useState("base-performance")

  const databases: {
    label: string
    value: string
    description: string
    isRecommended: boolean
  }[] = [
      {
        label: "FFT Size",
        value: "fft",
        description: "Fast Fourier Transform",
        isRecommended: true,
      },
      {
        label: "PSD",
        value: "psd",
        description: "Power Spectral Density",
        isRecommended: false,
      },
      {
        label: "Cepstrum",
        value: "cepstrum",
        description: "Cepstrum Analysis",
        isRecommended: false,
      },
      {
        label: "Envelope",
        value: "envelope",
        description: "Acceleration Envelope",
        isRecommended: false,
      },
    ]

  const [inputValues, setInputValues] = useState<InputValues>({
    filterSize: "256",
    windowType: "hann",
    overlap: "50",
  });

  const handleInputChange = (id: string) => (value: number | string) => {
    setInputValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  return (
    <div>
      <FLabel id={"filtername"} label={"Data Transform Name"} placeholder=" " />
      <form>
        <fieldset className="space-y-3 my-4">
          <Label htmlFor="database" className="font-medium my-1 ml-1">
            Select Type of Filter
          </Label>
          <RadioCardGroup
            value={selectedOption}
            onValueChange={(value) => setSelectedOption(value)}
            className="mt-2 grid grid-cols-2 gap-4  text-sm "
          >
            {databases.map((database) => (
              <RadioCardItem className="  hover:bg-slate-100 dark:hover:bg-slate-900" key={database.value} value={database.value}>
                <div className="flex items-start gap-3">
                  <RadioCardIndicator className="mt-1" />
                  <div>
                    {database.isRecommended ? (
                      <div className="flex items-center gap-2">
                        <span className="leading-6 dark:text-slate-100 font-bold">{database.label}</span>
                        <Badge>Recommended</Badge>
                      </div>
                    ) : (
                      <span className="leading-6  dark:text-slate-100 font-bold">{database.label}</span>
                    )}
                    <p className="mt-1 text-xs  dark:text-slate-400 text-gray-500">
                      {database.description}
                    </p>
                  </div>
                </div>
              </RadioCardItem>
            ))}
          </RadioCardGroup>
          <fieldset className="space-y-3"></fieldset>
          <Label htmlFor="database" className="font-medium my-1 ml-1">
            Transform Configurations
          </Label>
          <div className="flex flex-row gap-5">
            {/* <SelectNative id="selectNumber" className="rounded-lg w-[80px] p-3">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </SelectNative> */}


            {/* <div className="basis-1/3">
              <FLabel
                id="order"
                label="Filter Order"
                type="number"
                min={1}
                max={5}
                value={inputValues.order}
                onChange={handleInputChange("order")}
              />
            </div>
            <div className="w-1/3">
              <FLabel
                id="cutIn"
                label="Cut-in Freq"
                type="number"
                min={0}
                max={10000}
                value={inputValues.cutIn}
                onChange={handleInputChange("cutIn")}
              />
            </div>
            <div className="basis-1/3">
              <FLabel
                id="cutOut"
                label="Cut-out Freq"
                type="number"
                min={0}
                max={10000}
                value={inputValues.cutOut}
                onChange={handleInputChange("cutOut")}
              />
            </div> */}
            <div className="basis-1/3">
              {/* <FLabel
                id="order"
                label="Filter Order"
                type="number"
                min={1}
                max={5}
                value={inputValues.order}
                onChange={handleInputChange("order")}
              /> */}
              <div className="mx-auto gap-2 flex max-w-xs flex-col">
                <Label className='ml-2' htmlFor="age1">Select Size</Label>
                <SelectNative value={inputValues.filterSize}
  onChange={(e) => handleInputChange("filterSize")(e.target.value)}>

                  <option value="256">256</option>
                  <option value="512">512</option>
                  <option value="1024">1024</option>
                  <option value="2048">2048</option>
                  <option value="4096">4096</option>
                  <option value="8192">8192</option>
                </SelectNative>
              </div>

            </div>
            <div className="w-1/3">
            <div className="mx-auto gap-2 flex max-w-xs flex-col">
                <Label className='ml-2' htmlFor="age1">Select Window Type</Label>
                <SelectNative value={inputValues.windowType}
  onChange={(e) => handleInputChange("windowType")(e.target.value)}>

                  <option value="hann">Hanning</option>
                  <option value="hamming">Hamming</option>
                  <option value="rectangular">Rectangular</option>
                  <option value="flat-top">Flat-top</option>
                </SelectNative>
              </div>
            </div>
            <div className="basis-1/3">
            <div className="mx-auto gap-2 flex max-w-xs flex-col">
                <Label className='ml-2' htmlFor="age1">Select Overlap</Label>
                <SelectNative value={inputValues.overlap}
  onChange={(e) => handleInputChange("overlap")(e.target.value)}>

                  <option value="0">0%</option>
                  <option value="10">10%</option>
                  <option value="25">25%</option>
                  <option defaultChecked value="50">50%</option>
                  <option value="75">75%</option>
                  <option value="90">90%</option>
                </SelectNative>
              </div>

            </div>
          </div>

        </fieldset>
        <hr className="my-4"></hr>
        <div className="flex items-center justify-between">
          <Button
            className="mt-4"
            type=""
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading? 'Transforming...': 'Transform Data'}
          </Button>

          <Button
            className="mt-4"
            type="reset"
            variant="ghost"
            onClick={() => setSelectedOption("base-performance")}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransformDataForm;
