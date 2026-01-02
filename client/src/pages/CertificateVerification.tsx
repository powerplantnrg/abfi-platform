import { useState } from "react";
import { H1, H2, H3, H4, Body, MetricValue, DataLabel } from "@/components/Typography";
import { trpc } from "@/lib/trpc";
import { Check, Copy, Shield, FileCheck, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CertificateVerification() {
  const [activeTab, setActiveTab] = useState("verify");
  const [certificateId, setCertificateId] = useState("");
  const [computedHash, setComputedHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Generate SHA-256 hash from input data
  const generateHash = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleGenerateHash = async () => {
    if (!certificateId) return;

    // In real implementation, fetch certificate data from backend
    const mockCertificateData = JSON.stringify({
      id: certificateId,
      supplier: "Queensland Bioenergy Pty Ltd",
      feedstock: "Bagasse",
      quantity: 5000,
      date: "2024-12-13",
      verified: true,
    });

    const hash = await generateHash(mockCertificateData);
    setComputedHash(hash);
  };

  const handleVerifyHash = async () => {
    if (!computedHash) return;

    // Mock verification - in real implementation, call backend API
    setVerificationResult({
      valid: true,
      certificateId: certificateId,
      supplier: "Queensland Bioenergy Pty Ltd",
      feedstock: "Bagasse (Sugarcane)",
      quantity: "5,000 tonnes",
      issueDate: "2024-12-13",
      verifiedBy: "ABFI Platform",
      status: "Active",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[10%] w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12 pb-8 border-b border-gray-200">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-[#D4AF37] rounded-xl flex items-center justify-center">
              <span className="font-bold text-xl text-black">AB</span>
            </div>
            <h1 className="font-semibold text-3xl text-gray-900">
              ABFI <span className="text-[#D4AF37]">Platform</span>
            </h1>
          </div>

          <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
            🔒 Blockchain Verified
          </div>

          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Certificate Validation & Immutable Records
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Verify certificate authenticity using cryptographic hashing and
            blockchain-anchored records. All certificates are tamper-proof and
            independently auditable.
          </p>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 shadow-sm">
            <TabsTrigger
              value="verify"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black"
            >
              <Shield className="w-4 h-4 mr-2" />
              Verify Certificate
            </TabsTrigger>
            <TabsTrigger
              value="generate"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black"
            >
              <Hash className="w-4 h-4 mr-2" />
              Generate Hash
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          {/* Verify Certificate Tab */}
          <TabsContent value="verify" className="mt-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Verify Certificate by Hash
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter a certificate hash to verify its authenticity and view
                  details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="verifyHash"
                    className="text-xs uppercase tracking-wide text-gray-600"
                  >
                    Certificate Hash (SHA-256)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="verifyHash"
                      value={computedHash}
                      onChange={e => setComputedHash(e.target.value)}
                      placeholder="Enter 64-character SHA-256 hash..."
                      className="bg-gray-50 border-gray-300 font-mono text-sm flex-1"
                    />
                    <Button
                      onClick={handleVerifyHash}
                      className="bg-[#D4AF37] text-black hover:bg-[#c9a962]"
                    >
                      Verify
                    </Button>
                  </div>
                </div>

                {verificationResult && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-emerald-200">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-emerald-700">
                          Certificate Verified
                        </h3>
                        <p className="text-xs text-gray-600">
                          This certificate is authentic and has not been
                          tampered with
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Certificate ID
                        </p>
                        <p className="font-mono text-sm text-gray-900">
                          {verificationResult.certificateId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Status
                        </p>
                        <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-semibold">
                          {verificationResult.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Supplier
                        </p>
                        <p className="text-sm text-gray-900">
                          {verificationResult.supplier}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Feedstock Type
                        </p>
                        <p className="text-sm text-gray-900">
                          {verificationResult.feedstock}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Quantity
                        </p>
                        <p className="text-sm text-gray-900">
                          {verificationResult.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Issue Date
                        </p>
                        <p className="text-sm text-gray-900">
                          {verificationResult.issueDate}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-emerald-200">
                      <p className="text-xs text-gray-500 mb-2">Verified by</p>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-sm font-semibold text-[#D4AF37]">
                          {verificationResult.verifiedBy}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Hash Tab */}
          <TabsContent value="generate" className="mt-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Generate Certificate Hash
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Generate a cryptographic hash for a certificate to ensure
                  immutability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="certId"
                    className="text-xs uppercase tracking-wide text-gray-600"
                  >
                    Certificate ID
                  </Label>
                  <Input
                    id="certId"
                    value={certificateId}
                    onChange={e => setCertificateId(e.target.value)}
                    placeholder="e.g., CERT-2024-001234"
                    className="bg-gray-50 border-gray-300"
                  />
                </div>

                <Button
                  onClick={handleGenerateHash}
                  className="w-full bg-[#D4AF37] text-black hover:bg-[#c9a962]"
                >
                  <Hash className="w-4 h-4 mr-2" />
                  Generate Hash
                </Button>

                {computedHash && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs uppercase tracking-wide text-gray-600 font-semibold">
                        SHA-256 Hash
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-1 rounded text-xs font-mono">
                          <Hash className="w-3 h-3" />
                          SHA-256
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
                      <p className="font-mono text-xs text-gray-700 break-all leading-relaxed">
                        {computedHash}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(computedHash)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        {copied ? "Copied!" : "Copy Hash"}
                      </Button>
                      <Button
                        onClick={handleVerifyHash}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Shield className="w-3 h-3 mr-2" />
                        Verify Now
                      </Button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <strong className="text-gray-700">Note:</strong> This
                        hash is a cryptographic fingerprint of the certificate
                        data. Any modification to the certificate will result in
                        a completely different hash, ensuring tamper-proof
                        verification.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="mt-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Blockchain Audit Trail
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View the complete history of certificate verification events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      action: "Certificate Issued",
                      timestamp: "2024-12-13 10:30:15",
                      hash: "a3f8...92c1",
                      status: "success",
                    },
                    {
                      action: "Hash Generated",
                      timestamp: "2024-12-13 10:30:16",
                      hash: "a3f8...92c1",
                      status: "success",
                    },
                    {
                      action: "Blockchain Anchor",
                      timestamp: "2024-12-13 10:31:02",
                      hash: "a3f8...92c1",
                      status: "success",
                    },
                    {
                      action: "Verification Request",
                      timestamp: "2024-12-13 14:22:45",
                      hash: "a3f8...92c1",
                      status: "success",
                    },
                  ].map((event, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            event.status === "success"
                              ? "bg-emerald-100"
                              : "bg-gray-200"
                          }`}
                        >
                          <Check
                            className={`w-4 h-4 ${event.status === "success" ? "text-emerald-600" : "text-gray-500"}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {event.action}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {event.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Hash</p>
                        <p className="font-mono text-xs text-[#D4AF37]">
                          {event.hash}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-700 mb-1">
                        Immutability Guarantee
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        All certificate hashes are anchored to a public
                        blockchain, creating an immutable audit trail. Once
                        recorded, the data cannot be altered or deleted,
                        ensuring permanent proof of authenticity.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-[#D4AF37]/15 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tamper-Proof</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cryptographic hashing ensures any modification to certificate data
              is immediately detectable
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Blockchain Anchored
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Certificate hashes are permanently recorded on public blockchain
              for independent verification
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Hash className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">SHA-256 Standard</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Industry-standard cryptographic algorithm used by banks and
              governments worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
