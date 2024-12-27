import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
  CardBody,
  Divider,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Calendar, Filter } from "lucide-react";
import pb from "@/utils/pocketbase-connect";

type Payment = {
  id: string;
  created: string;
  updated: string;
  status: string;
  transaction_amount: number;
  type: string;
  payer_email: string;
  payer_mobile: string;
  details: {
    enrollment_id: string;
    final_payable_amount: number;
    platform_commission: number;
    salary: number;
  };
  error_message: string;
  remark: string;
  gateway_response: {
    description: string;
    notes: {
      enrollment_id: string;
      initiator: string;
      initiator_email: string;
      initiator_mobile: string;
      initiator_name: string;
      policy_name: string;
      reference_id: string;
    };
    short_url: string;
  };
  webhook_response: {
    acquirer_data: {
      rrn: string;
      upi_transaction_id: string;
    };
    upi: {
      vpa: string;
    };
    vpa: string;
  };
};

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Success", value: "SUCCESS" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const perPage = 10;

  useEffect(() => {
    fetchPayments(page);
  }, [page, statusFilter, dateRange]);

  const fetchPayments = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      let filter = "";
      if (statusFilter !== "all") {
        filter += `status = "${statusFilter}"`;
      }
      if (dateRange.from && dateRange.to) {
        filter += filter
          ? ` && created >= "${dateRange.from}" && created <= "${dateRange.to}"`
          : `created >= "${dateRange.from}" && created <= "${dateRange.to}"`;
      }

      const resultList = await pb
        .collection("payments_reference")
        .getList(pageNumber, perPage, {
          sort: "-created",
          filter: filter,
        });
      setPayments(resultList.items as unknown as Payment[]);
      setTotalPages(resultList.totalPages);
      setTotalItems(resultList.totalItems);
    } catch (err) {
      setError("An error occurred while fetching payment data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    onOpen();
  };

  const renderDetailSection = (title: string, content: React.ReactNode) => (
    <Card className="w-full">
      <CardBody>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <Divider className="my-3" />
        {content}
      </CardBody>
    </Card>
  );

  const renderDetailsRow = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between py-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return "success";
      case "PENDING":
        return "warning";
      case "FAILED":
        return "danger";
      default:
        return "default";
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" label="Loading payment data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-danger">{error}</p>
        <Button
          color="primary"
          className="mt-4"
          onPress={() => fetchPayments(page)}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Payment History</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          placeholder="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          startContent={<Filter className="w-4 h-4" />}
        >
          {statusOptions.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </Select>

        <Input
          type="date"
          placeholder="From"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          startContent={<Calendar className="w-4 h-4" />}
        />
        <Input
          type="date"
          placeholder="To"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          startContent={<Calendar className="w-4 h-4" />}
        />
      </div>

      {/* Table */}
      <Card>
        <CardBody>
          <Table
            aria-label="Payment history table"
            classNames={{
              wrapper: "min-h-[400px]",
            }}
          >
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>PAYER</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={loading ? "Loading..." : "No payments found"}
              isLoading={loading}
            >
              {payments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    {new Date(item.created).toLocaleDateString()}
                  </TableCell>
                  <TableCell>₹{item.transaction_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat">
                      {item.type}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(item.status)}
                      variant="flat"
                      size="sm"
                    >
                      {item.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-small">{item.payer_email}</span>
                      <span className="text-tiny text-default-500">
                        {item.payer_mobile}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => handleViewDetails(item)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span className="text-small text-default-500">
          Total {totalItems} payments
        </span>
        <Pagination
          total={totalPages}
          initialPage={1}
          page={page}
          onChange={setPage}
          showControls
          size="sm"
        />
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl">Payment Details</h2>
                <p className="text-small text-default-500">
                  ID: {selectedPayment?.id}
                </p>
              </ModalHeader>

              <ModalBody className="gap-4">
                {selectedPayment && (
                  <>
                    {renderDetailSection(
                      "Transaction Information",
                      <>
                        {renderDetailsRow(
                          "Created",
                          new Date(selectedPayment.created).toLocaleString()
                        )}
                        {renderDetailsRow(
                          "Amount",
                          `₹${selectedPayment.transaction_amount.toFixed(2)}`
                        )}
                        {renderDetailsRow("Type", selectedPayment.type)}
                        {renderDetailsRow(
                          "Status",
                          <Chip
                            color={getStatusColor(selectedPayment.status)}
                            variant="flat"
                            size="sm"
                          >
                            {selectedPayment.status}
                          </Chip>
                        )}
                      </>
                    )}

                    {renderDetailSection(
                      "Payer Information",
                      <>
                        {renderDetailsRow("Email", selectedPayment.payer_email)}
                        {renderDetailsRow(
                          "Mobile",
                          selectedPayment.payer_mobile
                        )}
                        {selectedPayment.remark &&
                          renderDetailsRow("Remark", selectedPayment.remark)}
                      </>
                    )}

                    {renderDetailSection(
                      "Payment Breakdown",
                      <>
                        {renderDetailsRow(
                          "Final Payable Amount",
                          `₹${
                            selectedPayment.details?.final_payable_amount || 0
                          }`
                        )}
                        {renderDetailsRow(
                          "Platform Commission",
                          `₹${
                            selectedPayment.details?.platform_commission || 0
                          }`
                        )}
                        {renderDetailsRow(
                          "Salary",
                          `₹${selectedPayment.details?.salary || 0}`
                        )}
                        {renderDetailsRow(
                          "Enrollment ID",
                          selectedPayment.details?.enrollment_id || "N/A"
                        )}
                      </>
                    )}

                    {renderDetailSection(
                      "Gateway Information",
                      <>
                        {renderDetailsRow(
                          "Description",
                          selectedPayment.gateway_response?.description || "N/A"
                        )}
                        {renderDetailsRow(
                          "Policy Name",
                          selectedPayment.gateway_response?.notes
                            ?.policy_name || "N/A"
                        )}
                        {renderDetailsRow(
                          "Initiator",
                          `${
                            selectedPayment.gateway_response?.notes
                              ?.initiator_name || "N/A"
                          } (${
                            selectedPayment.gateway_response?.notes
                              ?.initiator || "N/A"
                          })`
                        )}
                        {renderDetailsRow(
                          "UPI Transaction ID",
                          selectedPayment.webhook_response?.acquirer_data
                            ?.upi_transaction_id || "N/A"
                        )}
                        {renderDetailsRow(
                          "VPA",
                          selectedPayment.webhook_response?.vpa || "N/A"
                        )}
                      </>
                    )}
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}