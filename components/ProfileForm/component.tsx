"use client";

import React from "react";
import { useProfileForm } from "./hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Save } from "lucide-react";
import { EMAIL_POSTFIX } from "@/constants";
import Link from "next/link";
import { ProfileFormProps } from "./types";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeactivateUserForm } from "@/components/deactivate-user-form";
import { ROLE, STATUS } from "@/enum";

const ProfileForm = ({ employee, managementUsers }: ProfileFormProps) => {
  const { form, isLoading, teamLeads, onSubmit } = useProfileForm({
    employee,
    managementUsers,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Employee ID"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Full Name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      className="pe-12"
                      placeholder="Enter Email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                    {EMAIL_POSTFIX}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role*</FormLabel>
                <FormControl>
                  <Select
                    key={field.value}
                    value={field.value}
                    disabled={isLoading}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ROLE.USER}>{ROLE.USER}</SelectItem>
                      <SelectItem value={ROLE.MANAGER}>
                        {ROLE.MANAGER}
                      </SelectItem>
                      <SelectItem value={ROLE.ADMIN}>{ROLE.ADMIN}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teamLeadId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Lead*</FormLabel>
                <FormControl>
                  <Select
                    key={field.value}
                    value={field.value}
                    disabled={isLoading}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Team Lead" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teamLeads.map((lead) => (
                        <SelectItem key={lead.user.id} value={lead.user.id}>
                          {lead.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Designation"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="joinedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Joined At</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Date"
                    type="date"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Phone Number"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Link"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">Personal Information</h2>
          <div className="grid grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Address"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter DOB"
                      type="date"
                      disabled={isLoading}
                      max={new Date().toISOString().split("T")[0]} // Prevent future dates
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNIC</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter CNIC"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">Compensation Details</h2>
          <div className="grid grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Salary"
                      disabled={isLoading}
                      value={
                        field.value
                          ? typeof field.value === "number"
                            ? new Intl.NumberFormat("en-US").format(field.value)
                            : ""
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, "");
                        const numericValue =
                          rawValue === "" ? undefined : Number(rawValue);
                        field.onChange(numericValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Tax Amount"
                      disabled={isLoading}
                      value={
                        field.value
                          ? typeof field.value === "number"
                            ? new Intl.NumberFormat("en-US").format(field.value)
                            : ""
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, "");
                        const numericValue =
                          rawValue === "" ? undefined : Number(rawValue);
                        field.onChange(numericValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div
          className={`flex items-center ${
            employee ? "justify-between" : "justify-end"
          }`}
        >
          {employee && employee.user_detail?.status === STATUS.ACTIVE && (
            <DeactivateUserForm id={employee.user.id} />
          )}
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={{ pathname: "/admin/users" }}>Back</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
              {employee ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
