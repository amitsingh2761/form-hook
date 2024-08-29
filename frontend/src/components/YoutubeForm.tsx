import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Stack,
  FormHelperText,
  Paper,
  Typography,

  InputAdornment

} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { SendSharp } from "@mui/icons-material";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useEffect } from "react";
import axios from "axios";
const valStyle = { color: "red", fontFamily: "cursive", fontWeight: "bold" };



// let renderCount = 0;

export default function YoutubeForm() {

  //assigning default values below
  const form = useForm<formValues>({
    defaultValues: {
      username: "",
      email: "",
      channel: "",
      social: {
        facebook: "",
        twitter: "",
      },
      phone: ["", ""],
      addresses: [{ address: "" }],
      age: 0,
      DOB: new Date()
    },
    mode: "all"
  });

  const { register, control, handleSubmit, formState, watch, reset } = form;
  const { errors, dirtyFields, touchedFields, isDirty } = formState;

  const { isSubmitSuccessful, isSubmitted, isSubmitting, submitCount } = formState;
  console.log({ isSubmitSuccessful, isSubmitted, isSubmitting, submitCount })
  //for Dynamic fields
  const { fields, append, remove } = useFieldArray({
    name: "addresses",
    control
  })

  //implementation of the dirty, touched fields
  console.log({ touchedFields, dirtyFields })


  //for watching change in state of fields
  // const watchField = watch("username")
  // console.log(watchField)




  //form structure
  type formValues = {
    username: string;
    email: string;
    channel: string;
    social: {
      twitter: string;
      facebook: string;
    },
    phone: string[], //storing array data
    //adding dynamic field
    addresses: {
      address: string
    }[],          //array of Objects (mandatory)
    age: number,
    DOB: Date,
  }


  //implementation of setValues
  // const alterUser = () => {
  //   setValue("username", "someone you know", { shouldValidate: true, shouldTouch: true, shouldDirty: true })
  // }
  const atSubmit = (data: object) => {
    console.log("Form Submitted ", data);
    //implimention of getValues
    // console.log("getValues", getValues(["username", "age", "addresses"]))

  }

  //it allows us to keep track of change of states without re -rendering of the page
  // useEffect(() => {
  //   const subscribe = watch((value) => { console.log(value) })
  //   return () => { subscribe.unsubscribe() }
  // }, [watch])
  // renderCount++;

  useEffect(() => {
    if (isSubmitSuccessful) { reset() }
  }, [isSubmitSuccessful, reset])



  return (
    <>

      <Typography variant="h3" sx={{ fontFamily: "fantasy" }}>Youtube Form (
        {/* {renderCount / 2} */}
        )
      </Typography>
      <Paper sx={{ padding: 3 }} elevation={6}>
        <form autoComplete="false" onSubmit={handleSubmit(atSubmit, (errors: FieldErrors<formValues>) => {
          console.log("error(s) occured:", errors)
        })} noValidate>
          <Stack direction={"column"} gap={2} >
            <FormControl>
              <InputLabel htmlFor="username">User Name </InputLabel>
              <Input
                id="username"
                type="text"
                placeholder="enter your username"
                {...register("username", {
                  required: "UserName is Required !!!",
                  pattern: {
                    value: /^[a-zA-z]/,
                    message: "Enter Valid UserName (Starts with a-z / A-Z)",
                  },
                  minLength: {
                    value: 4,
                    message: "username length must atleast be 4",
                  },
                  maxLength: {
                    value: 15,
                    message: "username length must atmost be 15",
                  },


                },)}
              />
              <FormHelperText
                id="my-helper-text"
                className="validation-msg"
                sx={valStyle}
              >
                {errors.username?.message}
                {/* conditional chaining is neccesary */}
              </FormHelperText>
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                type="email"
                placeholder="enter your email"

                {...register("email", {
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "enter Valid Email Address",
                  },
                  required: "Email is Required !!!",
                  //Custom Validations
                  validate: {
                    isBlocked: (fieldValue) => {
                      return (
                        fieldValue !== "dante@gmail.com" ||
                        "Blocked Mail Address !!!"
                      );
                    },
                    isDuplicate: async (fieldValue) => {
                      const data = (await axios.get(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`)).data

                      return data.length == 0 || "Email Already Exists"

                    }
                  },
                })}
              />

              <FormHelperText
                id="my-helper-text"
                className="validation-msg"
                sx={valStyle}
              >
                {errors.email?.message}
              </FormHelperText>
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="channel">Channel Name</InputLabel>
              <Input
                id="channel"
                type="text"
                placeholder="enter your channel"
                {...register("channel", {
                  required: {
                    value: true,
                    message: "Channel name is required !!!",
                  },
                  maxLength: {
                    value: 15,
                    message: "too long name for a channel",
                  },
                  // minLength: { value: 4, message: "Channel name must be 4 or more characters long" },
                  validate: {
                    isBlocked: (fieldValue) => {
                      return (
                        fieldValue !== "Tseries" || "Blocked Channel Name !!!"
                      );
                    },
                    inValid: (fieldValue) => {
                      return (
                        !fieldValue.startsWith("@") || "something went wrong"
                      );
                    },
                  },
                })}
              />
              <FormHelperText
                className="validation-msg"
                id="my-helper-text"
                sx={valStyle}
              >
                {errors.channel?.message}
                {/* conditional chaining is neccesary */}
              </FormHelperText>
            </FormControl>

            <Stack direction={"row"} gap={1}>
              <FormControl>
                <InputLabel htmlFor="age">Age</InputLabel>

                <Input
                  id="age"
                  type="number"
                  {...register("age", {
                    valueAsNumber: true,
                    required: {
                      value: true,
                      message: "Required!!!",
                    },
                    min: { value: 1, message: "invalid Age !!" },
                    max: { value: 200, message: "invalid Age !!" },

                  })}
                />
                <FormHelperText
                  className="validation-msg"
                  id="my-helper-text"
                  sx={valStyle}
                >
                  {errors.age?.message}
                  {/* conditional chaining is neccesary */}
                </FormHelperText>
              </FormControl>



              <FormControl>
                <InputLabel htmlFor="DOB"></InputLabel>

                <Input
                  id="DOB"
                  type="date"
                  {...register("DOB", {
                    valueAsDate: true,
                    required: {
                      value: true,
                      message: "Required!!!",
                    },

                  })}
                />
                <FormHelperText
                  className="validation-msg"
                  id="my-helper-text"
                  sx={valStyle}
                >
                  {errors.DOB?.message}
                  {/* conditional chaining is neccesary */}
                </FormHelperText>
              </FormControl>
            </Stack>

            {/* Social Media Details */}

            <Stack direction={"row"} gap={1}>
              <FormControl>
                <InputLabel htmlFor="facebook">Facebook</InputLabel>

                <Input
                  id="facebook"
                  type="text"
                  {...register("social.facebook", {
                    disabled: watch("age") <= 18,

                  })}
                />
                <FormHelperText
                  className="validation-msg"
                  id="my-helper-text"
                  sx={valStyle}
                >
                  {errors.social?.facebook?.message}
                  {/* conditional chaining is neccesary */}
                </FormHelperText>
              </FormControl>

              <FormControl>
                <InputLabel htmlFor="twitter">Twitter</InputLabel>

                <Input
                  id="twitter"
                  type="text"
                  {...register("social.twitter", {
                    required: {
                      value: true,
                      message: "Required!!!",
                    },
                    maxLength: { value: 15, message: "Too Long !!" },
                    minLength: { value: 4, message: "Too Short !!" },
                  })}
                />
                <FormHelperText
                  className="validation-msg"
                  id="my-helper-text"
                  sx={valStyle}
                >
                  {errors.social?.twitter?.message}
                  {/* conditional chaining is neccesary */}
                </FormHelperText>
              </FormControl>
            </Stack>





            <Stack direction={"row"} gap={1}>
              <FormControl>
                <InputLabel htmlFor="primary">Primary Phone</InputLabel>

                <Input
                  id="primary"
                  type="text"
                  {...register("phone.0", {
                    required: {
                      value: true,
                      message: "Required!!!",
                    },
                    maxLength: { value: 10, message: "invalid Phone !!" },
                    minLength: { value: 10, message: "invalid Phone !!" },
                    pattern: {
                      value: /^[0-9]/,
                      message: "Must be Numeric",
                    },

                  })}
                />
                <FormHelperText
                  className="validation-msg"
                  id="my-helper-text"
                  sx={valStyle}
                >
                  {errors.phone?.[0]?.message}
                  {/* conditional chaining is neccesary */}
                </FormHelperText>
              </FormControl>



              <FormControl>
                <InputLabel htmlFor="secondary">Secondary Phone</InputLabel>

                <Input
                  id="secondary"
                  type="text"
                  {...register("phone.1", {
                    required: {
                      value: true,
                      message: "Required!!!",
                    },
                    maxLength: { value: 10, message: "invalid Phone !!" },
                    minLength: { value: 10, message: "invalid Phone !!" },
                    pattern: {
                      value: /^[0-9]/,
                      message: "Must be Numeric",
                    },
                    disabled: watch("age") < 10
                  })}
                />
                <FormHelperText
                  className="validation-msg"
                  id="my-helper-text"
                  sx={valStyle}
                >
                  {errors.phone?.[1]?.message}
                  {/* conditional chaining is neccesary */}
                </FormHelperText>
              </FormControl>
            </Stack>















            {/* //Dynamic Field */}
            <Stack direction={"column"} gap={1}>

              <div> Add Address
              </div>
              {fields.map((field, index) => (
                <FormControl key={field.id}>

                  <Input id="outlined-basic" type="text" size="small" fullWidth sx={{ padding: "10px" }}
                    {...register(`addresses.${index}.address` as const, {
                      required: {
                        value: true,
                        message: "required !!!"
                      },
                      pattern: {
                        value: /^[a-zA-z]/,
                        message: "invalid !!"
                      }
                    })}
                    startAdornment={

                      index === fields.length - 1 && <InputAdornment position="start" >
                        <ControlPointIcon sx={{ marginBottom: "2px", cursor: "pointer" }} onClick={() => { append({ address: "" }) }} />
                      </InputAdornment>

                    }
                    endAdornment={

                      index > 0 && <InputAdornment position="end" >
                        <DeleteIcon sx={{ marginBottom: "2px", cursor: "pointer" }} onClick={() => { remove(index) }} />
                      </InputAdornment>
                    }
                  />
                  <FormHelperText
                    id="my-helper-text"
                    className="validation-msg"
                    sx={valStyle}
                  >
                    {errors.addresses?.message}
                    {/* conditional chaining is neccesary */}
                  </FormHelperText>

                </FormControl>))}


            </Stack>






            <Button
              variant="contained"
              color="success"
              type="submit"
              onClick={atSubmit}
              sx={{ transition: "linear .3s" }}
              endIcon={<SendSharp />}
              disabled={
                // !isValid 
                // ||
                !isDirty
              }
            >
              Submit
            </Button>


            {/* <button onClick={() => { trigger() }}>Create Trigger</button> */}
          </Stack>
        </form>
      </Paper>
      <DevTool control={control} />
    </>
  );
}
