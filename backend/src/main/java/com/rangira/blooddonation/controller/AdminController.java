package com.rangira.blooddonation.controller;

import com.rangira.blooddonation.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/summary")
    public SummaryResponse getSummary() {
        return new SummaryResponse(
            adminService.countUsers(),
            adminService.countAppointments(),
            adminService.countAppointmentsByStatus("Pending"),
            adminService.countAppointmentsByStatus("Confirmed"),
            adminService.countAppointmentsByStatus("Completed"),
            adminService.countAppointmentsByStatus("Cancelled")
        );
    }

    record SummaryResponse(
            long totalUsers,
            long totalAppointments,
            long pendingAppointments,
            long confirmedAppointments,
            long completedAppointments,
            long cancelledAppointments
    ) {}
}
