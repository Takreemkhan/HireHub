"use client";
import * as React from "react";
import {
    Box,
    Drawer,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Divider,
    Chip,
    Paper,
} from "@mui/material";
import { useGetProposals } from "@/app/hook/useProfile";

const ProposalDraw = ({ proposalDrawOpen, setProposalDrawOpen, jobId, freelancerId, isJobAssigned }: any) => {
    const { data, isLoading, error } = useGetProposals({
        jobId: jobId || undefined,
        freelancerId: freelancerId || undefined,
    });

    const proposals = data?.proposals || [];
    const summary = data?.summary;

    console.log("Proposals data:", proposals, summary);

    if (isLoading) {
        return (
            <Drawer
                anchor="right"
                open={proposalDrawOpen}
                onClose={() => setProposalDrawOpen(false)}
            >
                <Box sx={{ width: 320, p: 3, textAlign: "center" }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading proposals...</Typography>
                </Box>
            </Drawer>
        );
    }

    if (error) {
        return (
            <Drawer
                anchor="right"
                open={proposalDrawOpen}
                onClose={() => setProposalDrawOpen(false)}
            >
                <Box sx={{ width: 320, p: 2 }}>
                    <Alert severity="error">
                        Failed to load proposals: {error.message}
                    </Alert>
                </Box>
            </Drawer>
        );
    }

    return (
        <div>


            <Drawer
                anchor="right"
                open={proposalDrawOpen}
                onClose={() => setProposalDrawOpen(false)}
            >
                <Box sx={{ width: 720 }} role="presentation">
                    {/* Header - unchanged except added mb for spacing below */}
                    <Box sx={{ p: 2, bgcolor: "#f97316", color: "white", mb: 2 }}>
                        <Typography variant="h6">Freelancer Proposal</Typography>
                        {summary && (
                            <Typography variant="body2">
                                Total Proposals: {summary.total} | Avg Bid: {summary.avgBid} {proposals[0]?.currency || "USD"}
                            </Typography>
                        )}
                    </Box>

                    <Divider />

                    {/* Proposal List */}
                    {proposals.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: "center" }}>
                            <Typography color="textSecondary">
                                No proposals found.
                            </Typography>
                        </Box>
                    ) : (
                        proposals.map((proposal: any) => (
                            <Paper key={proposal._id} elevation={0} sx={{ m: 2, p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {proposal.freelancerProfile?.name || "Unknown Freelancer"}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    {proposal.freelancerProfile?.email}
                                </Typography>

                                <Divider sx={{ my: 1 }} />

                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    <strong>Bid Amount:</strong> {proposal.bidAmount} {proposal.currency}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    <strong>Deposit Required:</strong> {proposal.depositRequired} {proposal.currency}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    <strong>Duration:</strong> {proposal.estimatedDuration || "Not specified"}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    <strong>Status:</strong>{" "}
                                    <Chip
                                        label={isJobAssigned ? "Job Assigned" : proposal.status}
                                        size="small"
                                        color={isJobAssigned ? "success" : (proposal.status === "pending" ? "warning" : "default")}
                                    />
                                </Typography>

                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    <strong>Cover Letter:</strong> {proposal.proposalText}
                                </Typography>

                                {proposal.coverLetter && (
                                    <Typography variant="body2" sx={{ mt: 2 }}>
                                        <strong>Cover Letter:</strong> {proposal.coverLetter}
                                    </Typography>
                                )}

                                <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.disabled" }}>
                                    Submitted: {new Date(proposal.createdAt).toLocaleString()}
                                </Typography>
                            </Paper>
                        ))
                    )}
                </Box>
            </Drawer>
        </div>
    );
};

export default ProposalDraw;