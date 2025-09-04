package utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentHtmlReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.net.URI;
import java.net.URISyntaxException;

// ✅ Import your config manager
import api.InjiVerifyConfigManager;

public class ExtentReportManager {
    private static ExtentReports extent;
    private static ExtentTest test;
    private static long startTime;

    public static void initReport() {
        if (extent == null) {
            startTime = System.currentTimeMillis();

            ExtentHtmlReporter htmlReporter = new ExtentHtmlReporter("test-output/ExtentReport.html");
            htmlReporter.config().setTheme(Theme.DARK);
            htmlReporter.config().setDocumentTitle("Automation Report");

            // ✅ Set the Report Name as Test URL without https://
            try {
                String testUrl = BaseTest.url;
                String host = getHostFromUrl(testUrl);
                htmlReporter.config().setReportName(host);
            } catch (Exception e) {
                System.err.println("Could not set Report Name from URL: " + e.getMessage());
                htmlReporter.config().setReportName("Test Execution Report");
            }

            extent = new ExtentReports();
            extent.attachReporter(htmlReporter);

            addSystemInfo();
        }
    }

    private static void addSystemInfo() {
        String branch = getGitBranch();
        String commitId = getGitCommitId();

        if (extent != null) {
            if (branch != null) extent.setSystemInfo("Git Branch", branch);
            if (commitId != null) extent.setSystemInfo("Git Commit ID", commitId);

            // ✅ Add the Test URL from BaseTest
            try {
                extent.setSystemInfo("Test URL", BaseTest.url);
            } catch (Exception e) {
                System.err.println("Could not fetch Test URL: " + e.getMessage());
            }

            // ✅ Add Dependent URL from InjiVerifyConfigManager
            try {
                String dependentUrl = InjiVerifyConfigManager.getInjiWebUi();
                extent.setSystemInfo("Dependent URL", dependentUrl);
            } catch (Exception e) {
                System.err.println("Could not fetch Dependent URL: " + e.getMessage());
            }

            // ✅ Add Execution Start Time
            String startTimeStr = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(startTime));
            extent.setSystemInfo("Execution Start Time", startTimeStr);
        }
    }

    public static void createTest(String testName) {
        test = extent.createTest(testName);
    }

    public static void logStep(String message) {
        if (test != null) {
            test.info(message);
        }
    }

    public static void flushReport() {
        if (extent != null) {
            extent.flush();
        }
    }

    public static ExtentTest getTest() {
        return test;
    }

    private static String getGitBranch() {
        try {
            Process process = Runtime.getRuntime().exec("git rev-parse --abbrev-ref HEAD");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            return reader.readLine();
        } catch (IOException | NullPointerException e) {
            System.err.println("Failed to get Git branch: " + e.getMessage());
            return null;
        }
    }

    private static String getGitCommitId() {
        try {
            Process process = Runtime.getRuntime().exec("git rev-parse HEAD");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            return reader.readLine();
        } catch (IOException | NullPointerException e) {
            System.err.println("Failed to get Git commit ID: " + e.getMessage());
            return null;
        }
    }

    // ✅ Extract host from URL (remove https://)
    private static String getHostFromUrl(String url) {
        try {
            URI uri = new URI(url);
            return uri.getHost();
        } catch (URISyntaxException e) {
            System.err.println("Invalid URL: " + url);
            return url; // fallback to full URL if parsing fails
        }
    }
}
