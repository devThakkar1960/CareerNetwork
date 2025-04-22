import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            }
            return (
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
            );
        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Posted Jobs</h2>

            <Table className="border border-gray-200 rounded-lg overflow-hidden">
                <TableHeader className="bg-gray-100 text-gray-700">
                    <TableRow>
                        <TableHead className="p-4">Company</TableHead>
                        <TableHead className="p-4">Role</TableHead>
                        <TableHead className="p-4">Date</TableHead>
                        <TableHead className="p-4 text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filterJobs.length > 0 ? (
                        filterJobs.map((job) => (
                            <TableRow key={job._id} className="hover:bg-gray-50 transition-all">
                                <TableCell className="p-4 flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={job?.company?.logo || '/default-logo.png'} />
                                    </Avatar>
                                    <span className="font-semibold text-gray-800">{job?.company?.name}</span>
                                </TableCell>
                                <TableCell className="p-4 text-gray-700">{job?.title}</TableCell>
                                <TableCell className="p-4 text-gray-600">{job.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="p-4 text-center">
                                    <Popover>
                                        <PopoverTrigger className="p-2 rounded-md hover:bg-gray-200 transition-all">
                                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-2 bg-white border border-gray-200 rounded-md shadow-lg">
                                            <div
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer mt-2"
                                            >
                                                <Eye className="text-green-600" />
                                                <span>View Applications</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="4" className="text-center py-6 text-gray-500">
                                No jobs found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;
