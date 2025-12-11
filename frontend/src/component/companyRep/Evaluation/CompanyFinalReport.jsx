import React, { useEffect, useState } from "react";
import { Table, Input, Button, notification, InputNumber, Modal } from "antd";
import finalReportApi from "../../API/FinalReportAPI";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function CompanyFinalReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // PDF Viewer
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const layoutPlugin = defaultLayoutPlugin();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await finalReportApi.getAll();
      setReports(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      notification.error({
        message: "Không thể tải dữ liệu",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleEdit = (record) => {
    setEditingId(record.finalreportId);
    setFormData({
      companyRating: record.companyRating ?? "",
      companyFeedback: record.companyFeedback ?? "",
      companyEvaluator: record.companyEvaluator ?? "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async (record) => {
    const data = new FormData();
    data.append("FinalreportId", record.finalreportId);
    data.append("UserId", record.userId);
    data.append("JobPositionId", record.jobPositionId);
    data.append("SemesterId", record.semesterId);
    data.append("StudentReportText", record.studentReportText ?? "");
    data.append("CompanyFeedback", formData.companyFeedback ?? "");
    data.append("CompanyRating", formData.companyRating ?? "");
    data.append("CompanyEvaluator", formData.companyEvaluator ?? "");

    try {
      await finalReportApi.update(data);
      notification.success({ message: "Cập nhật thành công" });
      setEditingId(null);
      fetchReports();
    } catch (err) {
      notification.error({
        message: "Cập nhật thất bại",
        description: err.message,
      });
    }
  };

  const openPdfModal = (fileUrl) => {
    setPdfUrl(fileUrl);
    setIsPdfModalVisible(true);
  };

  const closePdfModal = () => {
    setPdfUrl(null);
    setIsPdfModalVisible(false);
  };

  const columns = [
    {
      title: "FinalReport ID",
      dataIndex: "finalreportId",
      key: "finalreportId",
      sorter: (a, b) => a.finalreportId - b.finalreportId,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: "Job Position ID",
      dataIndex: "jobPositionId",
      key: "jobPositionId",
      sorter: (a, b) => a.jobPositionId - b.jobPositionId,
    },
    {
      title: "Semester ID",
      dataIndex: "semesterId",
      key: "semesterId",
    },
    {
      title: "Student Report",
      dataIndex: "studentReportFile",
      key: "studentReportFile",
      render: (file) =>
        file ? (
          <>
            
            <a href={file} download>
              Tải xuống
            </a>
          </>
        ) : (
          "Chưa có file"
        ),
    },
    {
      title: "Student Text",
      dataIndex: "studentReportText",
      key: "studentReportText",
      render: (text) => text || "-",
    },

    {
      title: "Company Rating",
      dataIndex: "companyRating",
      key: "companyRating",
      render: (text, record) =>
        editingId === record.finalreportId ? (
          <InputNumber
            min={0}
            max={5}
            value={formData.companyRating}
            onChange={(v) => setFormData({ ...formData, companyRating: v })}
          />
        ) : (
          text ?? "-"
        ),
    },

    {
      title: "Company Feedback",
      dataIndex: "companyFeedback",
      key: "companyFeedback",
      render: (text, record) =>
        editingId === record.finalreportId ? (
          <Input.TextArea
            rows={2}
            value={formData.companyFeedback}
            onChange={(e) =>
              setFormData({ ...formData, companyFeedback: e.target.value })
            }
          />
        ) : (
          text ?? "-"
        ),
    },

    {
      title: "Company Evaluator",
      dataIndex: "companyEvaluator",
      key: "companyEvaluator",
      render: (text, record) =>
        editingId === record.finalreportId ? (
          <Input
            value={formData.companyEvaluator}
            onChange={(e) =>
              setFormData({ ...formData, companyEvaluator: e.target.value })
            }
          />
        ) : (
          text ?? "-"
        ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        editingId === record.finalreportId ? (
          <>
            <Button type="link" onClick={() => handleSave(record)}>
              Lưu
            </Button>
            <Button type="link" onClick={handleCancel}>
              Hủy
            </Button>
          </>
        ) : (
          <Button type="link" onClick={() => handleEdit(record)}>
            Chấm điểm
          </Button>
        ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách Final Report</h2>

      <Table
        dataSource={reports}
        columns={columns}
        rowKey="finalreportId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* PDF Preview Modal */}
      <Modal
        open={isPdfModalVisible}
        title="Xem báo cáo sinh viên"
        onCancel={closePdfModal}
        footer={null}
        width="80%"
        style={{ top: 20 }}
        bodyStyle={{ height: "80vh" }}
      >
        {pdfUrl && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} plugins={[layoutPlugin]} />
          </Worker>
        )}
      </Modal>
    </div>
  );
}
