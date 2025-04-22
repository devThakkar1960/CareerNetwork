import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchQuery } from '../redux/jobSlice'

const filterData = [
    {
        filterType: "Location",
        array:["Delhi", "Gujarat","Banglore", "Hydrabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array:["Backend Developer","Frontend Developer", "Data Scientist", "Editing"]
    }
]
function FilterCard() {
  const [selectedValue, setSelectedValue] = useState('')
  const dispatch = useDispatch()

  const changeHandler = (value) => {
    setSelectedValue(value)
  }

  useEffect(()=>{
     dispatch(setSearchQuery(selectedValue))
  }, [selectedValue])
  return (
    <div className='w-full bg-white p-3 rounded-md'>
        <h1>Filter Jobs</h1>
        <hr className='mt-3'/>
        <RadioGroup value={selectedValue} onValueChange = {changeHandler} className='mr-10'>
            {
                filterData.map((data, index) => (
                    <div>
                        <h1 className='font-bold text-black'>{data.filterType}</h1>
                        {
                            data.array.map((item,idx)=>{
                                const itemId = `r${index}-${idx}`
                                return (
                                    <div className='flex items-center space-x-4 my-3'>
                                        <RadioGroupItem value={item} id={itemId}/>
                                        <Label htmlfor={itemId}>{item}</Label>
                                    </div>
                                )
                              })
                        }
                    </div>
                ) )
            }
        </RadioGroup>

    </div>
  )
}

export default FilterCard