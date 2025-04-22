import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    return (
        <div className="p-4">
            <Table className="border border-gray-300 shadow-md rounded-lg overflow-hidden">
                <TableCaption className="text-gray-600 font-medium">A list of your recently registered companies</TableCaption>
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="border-b border-gray-300 p-3">Logo</TableHead>
                        <TableHead className="border-b border-gray-300 p-3">Name</TableHead>
                        <TableHead className="border-b border-gray-300 p-3">Date</TableHead>
                        <TableHead className="border-b border-gray-300 p-3 text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <TableRow key={company._id} className="hover:bg-gray-50">
                                <TableCell className="border-b border-gray-300 p-3">
                                    <Avatar>
                                        <AvatarImage src={company.logo} />
                                    </Avatar>
                                </TableCell>
                                <TableCell className="border-b border-gray-300 p-3 font-medium">{company.name}</TableCell>
                                <TableCell className="border-b border-gray-300 p-3 text-gray-600">{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="border-b border-gray-300 p-3 text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className="text-gray-600 hover:text-black transition-colors" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 bg-white shadow-lg rounded-md p-2">
                                            <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer text-gray-700 hover:text-black'>
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable
