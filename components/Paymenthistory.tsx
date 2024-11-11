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
} from "@nextui-org/react";
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

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const perPage = 10;

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  const fetchPayments = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const resultList = await pb
        .collection("payments_reference")
        .getList(pageNumber, perPage, {
          sort: "-created",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Loading payment data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>
      <Table aria-label="Payment history table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Payer</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {payments.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                {new Date(item.created).toLocaleDateString()}
              </TableCell>
              <TableCell>₹{item.transaction_amount.toFixed(2)}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <Chip
                  color={item.status === "SUCCESS" ? "success" : "warning"}
                  variant="flat"
                >
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell>
                <div>{item.payer_email}</div>
                <div>{item.payer_mobile}</div>
              </TableCell>
              <TableCell>
                <Button size="sm" onPress={() => handleViewDetails(item)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination
          total={totalPages}
          initialPage={1}
          page={page}
          onChange={(page) => setPage(page)}
        />
      </div>
      <div className="text-center mt-2">Total Items: {totalItems}</div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Payment Details
              </ModalHeader>
              <ModalBody>
                {selectedPayment && (
                  <div className="space-y-4 p-4">
                    {/* Payment Info */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                      <h2 className="text-xl font-bold mb-2">
                        Payment Details
                      </h2>
                      <p>
                        <strong>ID:</strong> {selectedPayment.id}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(selectedPayment.created).toLocaleString()}
                      </p>
                      <p>
                        <strong>Updated:</strong>{" "}
                        {new Date(selectedPayment.updated).toLocaleString()}
                      </p>
                      <p>
                        <strong>Amount:</strong> ₹
                        {selectedPayment.transaction_amount.toFixed(2)}
                      </p>
                      <p>
                        <strong>Type:</strong> {selectedPayment.type}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`text-${
                            selectedPayment.status === "Paid" ? "green" : "red"
                          }-500`}
                        >
                          {selectedPayment.status}
                        </span>
                      </p>
                      <p>
                        <strong>Payer Email:</strong>{" "}
                        {selectedPayment.payer_email}
                      </p>
                      <p>
                        <strong>Payer Mobile:</strong>{" "}
                        {selectedPayment.payer_mobile}
                      </p>
                      <p>
                        <strong>Remark:</strong> {selectedPayment.remark}
                      </p>
                      <p>
                        <strong>Error Message:</strong>{" "}
                        {selectedPayment.error_message || "None"}
                      </p>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Details</h3>
                      <p>
                        <strong>Enrollment ID:</strong>{" "}
                        {selectedPayment.details?.enrollment_id || "N/A"}
                      </p>
                      <p>
                        <strong>Final Payable Amount:</strong> ₹
                        {selectedPayment.details?.final_payable_amount || 0}
                      </p>
                      <p>
                        <strong>Platform Commission:</strong> ₹
                        {selectedPayment.details?.platform_commission || 0}
                      </p>
                      <p>
                        <strong>Salary:</strong> ₹
                        {selectedPayment.details?.salary || 0}
                      </p>
                    </div>

                    {/* Gateway Response */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">
                        Gateway Response
                      </h3>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedPayment.gateway_response?.description || "N/A"}
                      </p>
                      <p>
                        <strong>Short URL:</strong>{" "}
                        {selectedPayment.gateway_response?.short_url || "N/A"}
                      </p>
                    </div>

                    {/* Notes */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Notes</h3>
                      <p>
                        <strong>Initiator:</strong>{" "}
                        {selectedPayment.gateway_response?.notes
                          ?.initiator_name || "N/A"}{" "}
                        (
                        {selectedPayment.gateway_response?.notes?.initiator ||
                          "N/A"}
                        )
                      </p>
                      <p>
                        <strong>Initiator Email:</strong>{" "}
                        {selectedPayment.gateway_response?.notes
                          ?.initiator_email || "N/A"}
                      </p>
                      <p>
                        <strong>Initiator Mobile:</strong>{" "}
                        {selectedPayment.gateway_response?.notes
                          ?.initiator_mobile || "N/A"}
                      </p>
                      <p>
                        <strong>Policy Name:</strong>{" "}
                        {selectedPayment.gateway_response?.notes?.policy_name ||
                          "N/A"}
                      </p>
                    </div>

                    {/* Webhook Response */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">
                        Webhook Response
                      </h3>
                      <p>
                        <strong>UPI Transaction ID:</strong>{" "}
                        {selectedPayment.webhook_response?.acquirer_data
                          ?.upi_transaction_id || "N/A"}
                      </p>
                      <p>
                        <strong>VPA:</strong>{" "}
                        {selectedPayment.webhook_response?.vpa || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button color="primary" onPress={onClose}>
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
