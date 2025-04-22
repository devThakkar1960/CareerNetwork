import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './ui/carousel'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchQuery } from '../redux/jobSlice'


const category = [
    "Frontend Developer",
    "Flutter Developer",
    "Data Scientist",
]

function CategoryCarousel() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchJobHandler = (query) => {
    dispatch(setSearchQuery(query))
    navigate("/browse")
  }
  return (
    <div>
        <Carousel className='w-full max-w-xl mx-auto my-20'>
            <CarouselContent>
                {
                    category.map((cat, index) => (
                        <CarouselItem className='md:basis-1/3 lg-basis-1/2'>
                          <Button onClick = {() => searchJobHandler(cat)}variant='outline' className='rounded-full'>
                            {cat}
                          </Button>
                        </CarouselItem>
                    ))
                }
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext/>
        </Carousel>
    </div>
  )
}

export default CategoryCarousel